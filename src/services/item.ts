import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IFilterQuery } from 'interfaces/IFilterQuery';
import { IResponse } from 'interfaces/IResponse';
import { API_BASE_URL } from 'utils';

const baseUrl = `${API_BASE_URL}/ws/v2/nft/`;

export interface CreateItemResponse {
  success: boolean;
  status: string;
  data: any;
  code: number;
}

export enum ITokenType {
  ERC721,
  ERC1155,
}

export interface CreateItemRequest {
  artFile: string;
  name: string;
  externalLink: string;
  description: string;
  collectionId: string;
  properties: any;
  tokenType: ITokenType;
  isLockContent: boolean;
  lockContent: string;
  isExplicit: boolean;
}

export const itemApi = createApi({
  reducerPath: 'item',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('@nft.arc.market:jwt');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [],
  endpoints: (builder) => ({
    getItems: builder.query<IResponse, IFilterQuery | void>({
      query: (filter: IFilterQuery | void) => {
        let filters = '[{"fieldName":"","query":""}]';
        if (filter && filter.query) {
          filters = `[{"fieldName":"name","query":"${filter.query}"}]`;
        } else if (!filter) {
          return {
            url: 'items',
          };
        }
        return {
          url: 'items',
          params: { filters },
        };
      },
    }),
    getTrendingItems: builder.query<IResponse, void>({
      query: () => 'items/trending',
    }),
    getItemsByTag: builder.query<IResponse, string | void>({
      query: (_tag: string) => `items/tag/${_tag}`,
    }),
    getOffers: builder.query<IResponse, any>({
      query: (body) => `items/${body.contract}/${body.index}/offers`,
    }),
    getHistory: builder.query<IResponse, any>({
      query: (body) => `items/${body.contract}/${body.index}/history`,
    }),
    getItem: builder.query<IResponse, any>({
      query: (body) => `items/${body.contract}/${body.index}`,
    }),
    create: builder.mutation<CreateItemResponse, FormData>({
      query: (body) => ({
        url: 'items/create',
        method: 'post',
        body,
      }),
    }),
    batchUpload: builder.mutation<CreateItemResponse, FormData>({
      query: (body) => ({
        url: 'items/batch-upload',
        method: 'post',
        body,
      }),
    }),
    update: builder.mutation<CreateItemResponse, any>({
      query: ({ nftId, body }) => ({
        url: `items/${nftId}`,
        method: 'put',
        body,
      }),
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetTrendingItemsQuery,
  useGetItemsByTagQuery,
  useGetOffersQuery,
  useGetHistoryQuery,
  useGetItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useBatchUploadMutation,
} = itemApi;
