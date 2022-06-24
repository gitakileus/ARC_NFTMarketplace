import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from 'interfaces/IResponse';
import { API_BASE_URL } from 'utils';

const baseUrl = `${API_BASE_URL}/ws/v2/nft/rewards`;

export const rewardApi = createApi({
  reducerPath: 'reward',
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
    getReward: builder.query<IResponse, string | null | undefined>({
      query: (_walletId: string) => `/${_walletId}`,
    }),
    getAirdropReward: builder.query<IResponse, string | null | undefined>({
      query: (_walletId: string) => `/airdrop/${_walletId}`,
    }),
  }),
});

export const { useGetRewardQuery, useGetAirdropRewardQuery } = rewardApi;
