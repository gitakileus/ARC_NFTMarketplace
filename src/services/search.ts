import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from 'interfaces/IResponse';
import { API_BASE_URL } from 'utils';

const baseUrl = `${API_BASE_URL}/ws/v2/nft`;

export const searchApi = createApi({
  reducerPath: 'search',
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
    getSearch: builder.query<IResponse, string | void>({
      query: (keyword: string) => {
        return {
          url: 'search',
          params: { keyword },
        };
      },
    }),
  }),
});

export const { useGetSearchQuery } = searchApi;
