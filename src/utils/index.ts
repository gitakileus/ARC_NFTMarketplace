import { getAddress } from '@ethersproject/address';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers';

export const API_BASE_URL = process.env.REACT_APP_API_URL ?? 'https://development.api.arc.market';
export const SITE_KEY = process.env.REACT_APP_SITE_KEY ?? '6Ld7lsYfAAAAAB0sHaIayIJc6y2r4unGZ6brMgdi';

export function isEthereumChain(chainId: number) {
  return chainId === 1 || chainId === 3 || chainId === 4 || chainId === 5;
}

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}
// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};
export const shortenString = (address: string, chars = 16): string => {
  if (address.length > chars) {
    return `${address.substring(0, chars)}...`;
  }
  return address;
};

export const calculateTime = (startDate: number, endDate: number) => {
  let retVal;
  if (Math.round((endDate - startDate) / 60000) < 0) return 'X';
  else if (Math.round((endDate - startDate) / 60000) < 60) retVal = Math.round((endDate - startDate) / 60000) + ' mins';
  else if (Math.round((endDate - startDate) / 60000) < 3600)
    retVal = Math.round((endDate - startDate) / 3600000) + ' hours';
  else if (Math.round((endDate - startDate) / 60000) < 86400)
    retVal = Math.round((endDate - startDate) / 86400000) + ' days';
  else if (Math.round((endDate - startDate) / 60000) < 604800)
    retVal = Math.round((endDate - startDate) / 604800000) + ' weeks';
  else retVal = Math.round((endDate - startDate) / 2678400000) + ' months';

  return retVal;
};

export const compareFloorPrice = (price: number, floorPrice: number) => {
  let retVal;
  if (price === 0 || floorPrice === 0) return;
  if (price > floorPrice) {
    retVal = Math.round((price / floorPrice - 1) * 100) + '% above floor';
  } else if (price === floorPrice) retVal = '0 % above floor';
  else retVal = Math.round((floorPrice / price - 1) * 100) + '% below floor';
  return retVal;
};

export const numberWithCommas = (x: number) => {
  return x
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}
