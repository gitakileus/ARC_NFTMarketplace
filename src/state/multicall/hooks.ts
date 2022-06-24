import {
  addMulticallListeners,
  Call,
  removeMulticallListeners,
  parseCallKey,
  toCallKey,
  ListenerOptions,
} from './actions';
import { Interface, FunctionFragment } from '@ethersproject/abi';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useBlockNumber } from 'state/application/hooks';
import { AppDispatch, AppState } from 'store';
import { isEthereumChain } from 'utils';
import { useWeb3 } from 'web3';

export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any;
}

type MethodArg = string | number | BigNumber;
type MethodArgs = Array<MethodArg | MethodArg[]>;

export type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined;

function isMethodArg(x: unknown): x is MethodArg {
  return BigNumber.isBigNumber(x) || ['string', 'number'].indexOf(typeof x) !== -1;
}

function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  );
}

interface CallResult {
  readonly valid: boolean;
  readonly data: string | undefined;
  readonly blockNumber: number | undefined;
}

const INVALID_RESULT: CallResult = {
  valid: false,
  blockNumber: undefined,
  data: undefined,
};

// use this options object
export const NEVER_RELOAD: ListenerOptions = {
  blocksPerFetch: Infinity,
};

// the lowest level call for subscribing to contract data
function useCallsData(calls: (Call | undefined)[], options?: ListenerOptions): CallResult[] {
  const callResults = useSelector<AppState, AppState['multicall']['callResults']>(
    (state) => state.multicall.callResults
  );
  const dispatch = useDispatch<AppDispatch>();
  const { chainId } = useWeb3();

  const serializedCallKeys: string = useMemo(
    () =>
      JSON.stringify(
        calls
          ?.filter((c): c is Call => Boolean(c))
          ?.map(toCallKey)
          ?.sort() ?? []
      ),
    [calls]
  );

  // update listeners when there is an real change that persists for at least 100ms
  useEffect(() => {
    const callKeys: string[] = JSON.parse(serializedCallKeys);
    if (!chainId || callKeys.length === 0) return undefined;
    const calls = callKeys.map((key) => parseCallKey(key));

    const listenerOptions = options ?? {
      blocksPerFetch: isEthereumChain(chainId) ? 1 : 15,
    };

    dispatch(
      addMulticallListeners({
        chainId,
        calls,
        options: listenerOptions,
      })
    );

    return () => {
      dispatch(
        removeMulticallListeners({
          chainId,
          calls,
          options: listenerOptions,
        })
      );
    };
  }, [chainId, dispatch, options, serializedCallKeys]);

  return useMemo(
    () =>
      calls.map<CallResult>((call) => {
        if (!chainId || !call) return INVALID_RESULT;

        const result = callResults[chainId]?.[toCallKey(call)];
        let data;
        if (result?.data && result?.data !== '0x') {
          data = result.data;
        }

        return { valid: true, data, blockNumber: result?.blockNumber };
      }),
    [callResults, calls, chainId]
  );
}

export interface CallState {
  readonly valid: boolean;
  // the result, or undefined if loading or errored/no data
  readonly result: Result | undefined;
  // true if the result has never been fetched
  readonly loading: boolean;
  // true if the result is not for the latest block
  readonly syncing: boolean;
  // true if the call was made and is synced, but the return data is invalid
  readonly error: boolean;
}

const INVALID_CALL_STATE: CallState = {
  valid: false,
  result: undefined,
  loading: false,
  syncing: false,
  error: false,
};
const LOADING_CALL_STATE: CallState = {
  valid: true,
  result: undefined,
  loading: true,
  syncing: true,
  error: false,
};

function toCallState(
  callResult: CallResult | undefined,
  contractInterface: Interface | undefined,
  fragment: FunctionFragment | undefined,
  latestBlockNumber: number | undefined
): CallState {
  if (!callResult) return INVALID_CALL_STATE;
  const { valid, data, blockNumber } = callResult;
  if (!valid) return INVALID_CALL_STATE;
  if (valid && !blockNumber) return LOADING_CALL_STATE;
  if (!contractInterface || !fragment || !latestBlockNumber) return LOADING_CALL_STATE;
  const success = data && data.length > 2;
  const syncing = (blockNumber ?? 0) < latestBlockNumber;
  let result: Result | undefined = undefined;
  if (success && data) {
    try {
      result = contractInterface.decodeFunctionResult(fragment, data);
    } catch (error) {
      console.debug('Result data parsing failed', fragment, data);
      return {
        valid: true,
        loading: false,
        error: true,
        syncing,
        result,
      };
    }
  }
  return {
    valid: true,
    loading: false,
    syncing,
    result,
    error: !success,
  };
}

export function useSingleContractMultipleData(
  contract: Contract | null | undefined,
  methodName: string,
  callInputs: OptionalMethodInputs[],
  options?: ListenerOptions,
  gasRequired?: number
): CallState[] {
  const { chainId } = useWeb3();
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName]);

  const calls = useMemo(
    () =>
      contract && fragment && callInputs?.length > 0 && callInputs.every((inputs) => isValidMethodArgs(inputs))
        ? callInputs.map<Call>((inputs) => {
            return {
              address: contract.address,
              callData: contract.interface.encodeFunctionData(fragment, inputs),
              ...(gasRequired ? { gasRequired } : {}),
            };
          })
        : [],
    [contract, fragment, callInputs, gasRequired]
  );

  const results = useCallsData(calls, options);

  const latestBlockNumber = useBlockNumber(chainId);

  return useMemo(() => {
    return results.map((result) => toCallState(result, contract?.interface, fragment, latestBlockNumber));
  }, [fragment, contract, results, latestBlockNumber]);
}

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions,
  gasRequired?: number
): CallState[] {
  const { chainId } = useWeb3();
  const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName]);
  const callData: string | undefined = useMemo(
    () =>
      fragment && isValidMethodArgs(callInputs)
        ? contractInterface.encodeFunctionData(fragment, callInputs)
        : undefined,
    [callInputs, contractInterface, fragment]
  );

  const calls = useMemo(
    () =>
      fragment && addresses && addresses.length > 0 && callData
        ? addresses.map<Call | undefined>((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                  ...(gasRequired ? { gasRequired } : {}),
                }
              : undefined;
          })
        : [],
    [addresses, callData, fragment, gasRequired]
  );
  const results = useCallsData(calls, options);

  const latestBlockNumber = useBlockNumber(chainId);

  return useMemo(() => {
    return results.map((result) => toCallState(result, contractInterface, fragment, latestBlockNumber));
  }, [fragment, results, contractInterface, latestBlockNumber]);
}

export function useSingleCallResult(
  contract: Contract | null | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options?: ListenerOptions,
  gasRequired?: number
): CallState {
  const { chainId } = useWeb3();
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract, methodName]);

  const calls = useMemo<Call[]>(() => {
    return contract && fragment && isValidMethodArgs(inputs)
      ? [
          {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
            ...(gasRequired ? { gasRequired } : {}),
          },
        ]
      : [];
  }, [contract, fragment, inputs, gasRequired]);

  const result = useCallsData(calls, options)[0];

  const latestBlockNumber = useBlockNumber(chainId);

  return useMemo(() => {
    return toCallState(result, contract?.interface, fragment, latestBlockNumber);
  }, [result, contract, fragment, latestBlockNumber]);
}
