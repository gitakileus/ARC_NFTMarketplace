import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IFilterQuery } from 'interfaces/IFilterQuery';
import { IResponse } from 'interfaces/IResponse';
import { API_BASE_URL } from 'utils';

const baseUrl = `${API_BASE_URL}/ws/v2/nft/`;

export const collectionApi = createApi({
  reducerPath: 'collection',
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
    getCollections: builder.query<IResponse, IFilterQuery | void>({
      query: (filter: IFilterQuery | void) => {
        let filters = '[{"fieldName":"","query":""}]';
        if (filter && filter.fieldName && filter.query) {
          filters = `[{"fieldName":"${filter.fieldName}","query":"${filter.query}"}]`;
        } else if (filter && filter.query) {
          filters = `[{"fieldName":"name","query":"${filter.query}"}]`;
        } else if (!filter) {
          return {
            url: 'collection',
          };
        }
        return {
          url: 'collection',
          params: { filters },
        };
      },
    }),
    getCollectionsByTag: builder.query<IResponse, string | void>({
      query: (_tag: string) => `collection/tag/${_tag}`,
    }),
    getCollection: builder.query<IResponse, string | void>({
      query: (_id: string) => `collection/${_id}`,
    }),
    getCollectionByURL: builder.query<IResponse, string | void>({
      query: (url: string) => `collection/url/${url}`,
    }),
    getTopCollections: builder.query<IResponse, void>({
      query: () => `collection/top`,
    }),
    getItems: builder.query<IResponse, string | void>({
      query: (_id: string) => `collection/${_id}/items`,
    }),
    getOwners: builder.query<IResponse, string | void>({
      query: (_id: string) => `collection/${_id}/owners`,
    }),
    getHistory: builder.query<IResponse, string | void>({
      query: (_id: string) => `collection/${_id}/history`,
    }),
    getActivity: builder.query<IResponse, string | void>({
      query: (_id: string) => `collection/${_id}/activity`,
    }),
    getCollectionOffer: builder.query<IResponse, string | void>({
      query: (_id: string) => `collection/${_id}/offer`,
    }),
    create: builder.mutation<IResponse, FormData>({
      query: (body) => ({
        url: 'collection/create',
        method: 'post',
        body,
      }),
    }),
    update: builder.mutation<IResponse, any>({
      query: ({ _id, body }) => ({
        url: `collection/${_id}`,
        method: 'put',
        body,
      }),
    }),
    placeBid: builder.mutation({
      query: (body) => ({
        url: 'collection/placeBid',
        method: 'post',
        body,
      }),
    }),
  }),
});

export const {
  useGetCollectionQuery,
  useGetCollectionsByTagQuery,
  useGetCollectionByURLQuery,
  useGetCollectionsQuery,
  useGetTopCollectionsQuery,
  useGetItemsQuery,
  useGetOwnersQuery,
  useGetHistoryQuery,
  useGetActivityQuery,
  useGetCollectionOfferQuery,
  useCreateMutation,
  useUpdateMutation,
  usePlaceBidMutation,
} = collectionApi;
