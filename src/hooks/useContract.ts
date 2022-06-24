import { Contract } from '@ethersproject/contracts';
import ARC721ABI from 'abis/ARC721.json';
import ARC1155ABI from 'abis/ARC1155.json';
import CurrencyManagerABI from 'abis/CurrencyManager.json';
import ExchangeABI from 'abis/Exchange.json';
import ExecutionManagerABI from 'abis/ExecutionManager.json';
import RoyaltyFeeManagerABI from 'abis/RoyaltyFeeManager.json';
import RoyaltyFeeRegistryABI from 'abis/RoyaltyFeeRegistry.json';
import StrategyAnyItemFromCollectionForFixedPriceABI from 'abis/StrategyAnyItemFromCollectionForFixedPrice.json';
import StrategyPrivateSaleABI from 'abis/StrategyPrivateSale.json';
import StrategyStandardSaleForFixedPriceABI from 'abis/StrategyStandardSaleForFixedPrice.json';
import TransferManagerERC721ABI from 'abis/TransferManagerERC721.json';
import TransferManagerERC1155ABI from 'abis/TransferManagerERC1155.json';
import TransferSelectorNFTABI from 'abis/TransferSelectorNFT.json';
import ERC20_ABI from 'abis/erc20.json';
import MULTICALL_ABI from 'abis/multicall2.json';
import {
  ARC1155,
  ARC721,
  CurrencyManager,
  Exchange,
  ExecutionManager,
  Multicall2,
  RoyaltyFeeManager,
  RoyaltyFeeRegistry,
  StrategyAnyItemFromCollectionForFixedPrice,
  StrategyPrivateSale,
  StrategyStandardSaleForFixedPrice,
  TransferManagerERC1155,
  TransferManagerERC721,
  TransferSelectorNFT,
  Erc20,
} from 'abis/types';
import {
  ARC1155_ADDRESS,
  ARC721_ADDRESS,
  CURRENCY_MANAGER_ADDRESS,
  EXCHANGE_ADDRESS,
  EXECUTION_MANAGER_ADDRESS,
  MULTICALL_ADDRESS,
  ROYALTY_FEE_MANAGER_ADDRESS,
  ROYALTY_FEE_REGISTRY_ADDRESS,
  STRATEGY_ANY_ITEM_FROM_COLLECTION_FOR_FIXED_PRICE_ADDRESS,
  STRATEGY_PRIVATE_SALE_ADDRESS,
  STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS,
  TRANSFER_MANAGER_ERC1155_ADDRESS,
  TRANSFER_MANAGER_ERC721_ADDRESS,
  TRANSFER_SELECTOR_NFT_ADDRESS,
} from 'constants/addresses';
import { useMemo } from 'react';
import { getContract } from 'utils';
import { useWeb3 } from 'web3';

// returns null on errors
export function useContract<T extends Contract = Contract>(
  addressOrAddressMap: string | { [chainId: number]: string } | undefined,
  ABI: { [chainId: number]: any } | any,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId } = useWeb3();

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null;
    let address: string | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    let abi: any;
    if (!Array.isArray(ABI) && Object.keys(ABI).length > 0) abi = ABI[chainId];
    else abi = ABI;
    if (!abi) return null;
    try {
      return getContract(address, abi, provider, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [addressOrAddressMap, ABI, provider, chainId, withSignerIfPossible, account]) as T;
}

export function useMulticall2Contract() {
  return useContract<Multicall2>(MULTICALL_ADDRESS, MULTICALL_ABI, false) as Multicall2;
}

export function useARC721Contract() {
  return useContract<ARC721>(ARC721_ADDRESS, ARC721ABI, true) as ARC721;
}

export function useARC1155Contract() {
  return useContract<ARC1155>(ARC1155_ADDRESS, ARC1155ABI, true) as ARC1155;
}

export function useCurrencyManagerContract() {
  return useContract<CurrencyManager>(CURRENCY_MANAGER_ADDRESS, CurrencyManagerABI, true) as CurrencyManager;
}

export function useExchangeContract() {
  return useContract<Exchange>(EXCHANGE_ADDRESS, ExchangeABI, true) as Exchange;
}

export function useExecutionManagerContract() {
  return useContract<ExecutionManager>(EXECUTION_MANAGER_ADDRESS, ExecutionManagerABI, true) as ExecutionManager;
}

export function useRoyaltyFeeManagerContract() {
  return useContract<RoyaltyFeeManager>(ROYALTY_FEE_MANAGER_ADDRESS, RoyaltyFeeManagerABI, true) as RoyaltyFeeManager;
}

export function useRoyaltyFeeRegistryContract() {
  return useContract<RoyaltyFeeRegistry>(
    ROYALTY_FEE_REGISTRY_ADDRESS,
    RoyaltyFeeRegistryABI,
    true
  ) as RoyaltyFeeRegistry;
}

export function useStrategyAnyItemFromCollectionForFixedPriceContract() {
  return useContract<StrategyAnyItemFromCollectionForFixedPrice>(
    STRATEGY_ANY_ITEM_FROM_COLLECTION_FOR_FIXED_PRICE_ADDRESS,
    StrategyAnyItemFromCollectionForFixedPriceABI,
    true
  ) as StrategyAnyItemFromCollectionForFixedPrice;
}

export function useStrategyPrivateSaleContract() {
  return useContract<StrategyPrivateSale>(
    STRATEGY_PRIVATE_SALE_ADDRESS,
    StrategyPrivateSaleABI,
    true
  ) as StrategyPrivateSale;
}

export function useStrategyStandardSaleForFixedPriceContract() {
  return useContract<StrategyStandardSaleForFixedPrice>(
    STRATEGY_STANDARD_SALE_FOR_FIXED_PRICE_ADDRESS,
    StrategyStandardSaleForFixedPriceABI,
    true
  ) as StrategyStandardSaleForFixedPrice;
}

export function useTransferManagerERC721Contract() {
  return useContract<TransferManagerERC721>(
    TRANSFER_MANAGER_ERC721_ADDRESS,
    TransferManagerERC721ABI,
    true
  ) as TransferManagerERC721;
}

export function useTransferManagerERC1155Contract() {
  return useContract<TransferManagerERC1155>(
    TRANSFER_MANAGER_ERC1155_ADDRESS,
    TransferManagerERC1155ABI,
    true
  ) as TransferManagerERC1155;
}

export function useTransferSelectorNFTContract() {
  return useContract<TransferSelectorNFT>(
    TRANSFER_SELECTOR_NFT_ADDRESS,
    TransferSelectorNFTABI,
    true
  ) as TransferSelectorNFT;
}

export function useERC20TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean) {
  return useContract<Erc20>(tokenAddress, ERC20_ABI, withSignerIfPossible) as Erc20;
}
