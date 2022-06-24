import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from 'interfaces/IResponse';
import { API_BASE_URL } from 'utils';

const baseUrl = `${API_BASE_URL}/ws/v2/nft/owners`;

type IUploadPhotoRequest = {
  address: string;
  body: FormData;
};

export const ownerApi = createApi({
  reducerPath: 'owner',
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
    getOwners: builder.query<IResponse, any>({
      query: (body) => {
        const { orderBy, direction, filters } = body;
        return ``;
      },
    }),
    getOwner: builder.query<IResponse, string | void>({
      query: (address: string) => `/${address}`,
    }),
    getNfts: builder.query<IResponse, string | void>({
      query: (address: string) => `/${address}/nfts`,
    }),
    getHistory: builder.query<IResponse, string | void>({
      query: (address: string) => `/${address}/history`,
    }),
    getCollections: builder.query<IResponse, string | void>({
      query: (address: string) => `/${address}/collection`,
    }),
    getOffers: builder.query<IResponse, string | void>({
      query: (address: string) => `/${address}/offers`,
    }),
    update: builder.mutation({
      query: ({ address, ...patch }) => ({
        url: `/${address}`,
        method: 'put',
        body: patch,
      }),
    }),
    uploadPhoto: builder.mutation<IResponse, IUploadPhotoRequest>({
      query: ({ address, body }) => ({
        url: `/${address}/upload-profile`,
        method: 'post',
        body,
      }),
    }),
  }),
});

export const {
  useGetOwnersQuery,
  useGetOwnerQuery,
  useGetNftsQuery,
  useGetHistoryQuery,
  useGetCollectionsQuery,
  useGetOffersQuery,
  useUpdateMutation,
  useUploadPhotoMutation,
} = ownerApi;
