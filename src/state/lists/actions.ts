import { Collection, Nft } from './types';
import { ActionCreatorWithPayload, createAction } from '@reduxjs/toolkit';

type NewType = {
  pending: ActionCreatorWithPayload<{ contractAddress: string; chainId: number }>;
  fulfilled: ActionCreatorWithPayload<{ contractAddress: string; list: Nft[]; chainId: number }>;
  rejected: ActionCreatorWithPayload<{ contractAddress: string; chainId: number; errorMessage: string }>;
};

export const fetchNFTList: Readonly<NewType> = {
  pending: createAction('lists/fetchTokenList/pending'),
  fulfilled: createAction('lists/fetchTokenList/fulfilled'),
  rejected: createAction('lists/fetchTokenList/rejected'),
};
export const fetchCollectionList = createAction<{ chainId: number; list: Collection[] }>('lists/fetchCollectionList');
