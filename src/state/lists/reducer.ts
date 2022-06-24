import { fetchNFTList, fetchCollectionList } from './actions';
import { Collection, Nft } from './types';
import { createReducer } from '@reduxjs/toolkit';
import { SupportedChainId } from 'constants/addresses';

export interface ListsState {
  readonly nfts: {
    readonly [chainId: number]: {
      readonly [contractAddress: string]: Nft[];
    };
  };
  readonly collections: {
    readonly [chainId: number]: Collection[];
  };
}

type ListState = ListsState['nfts'][number][string];

export const initialState: ListsState = {
  nfts: {
    [SupportedChainId.MAINNET]: {},
    [SupportedChainId.RINKEBY]: {},
  },
  collections: {
    [SupportedChainId.MAINNET]: [],
    [SupportedChainId.RINKEBY]: [],
  },
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(fetchCollectionList, (state, { payload: { chainId, list } }) => {
      state.collections[chainId] = list;
    })
    .addCase(fetchNFTList.pending, (state, { payload: { contractAddress, chainId } }) => {
      console.log(`pending ${contractAddress} ${chainId}`);
    })
    .addCase(fetchNFTList.fulfilled, (state, { payload: { contractAddress, chainId, list } }) => {
      state.nfts[chainId][contractAddress] = list;
    })
    .addCase(fetchNFTList.rejected, (state, { payload: { contractAddress, chainId, errorMessage } }) => {
      console.log(`rejected ${contractAddress} ${chainId} ${errorMessage}`);
    })
);
