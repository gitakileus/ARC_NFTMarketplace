import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from 'interfaces/IResponse';
import { API_BASE_URL } from 'utils';

const baseUrl = `${API_BASE_URL}/ws/v2/nft/activity`;

export const activityApi = createApi({
  reducerPath: 'activity',
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
    getActivities: builder.query<IResponse, void>({
      query: () => ``,
    }),
    listForSale: builder.mutation<IResponse, any>({
      query: (body) => ({
        url: '/listForSale',
        method: 'post',
        body,
      }),
    }),
    cancelListForSale: builder.mutation<IResponse, any>({
      query: (body) => ({
        url: '/cancelListForSale',
        method: 'post',
        body,
      }),
    }),
    buyNow: builder.mutation<IResponse, any>({
      query: (body) => ({
        url: '/transfer',
        method: 'post',
        body,
      }),
    }),
    signOffer: builder.mutation<IResponse, any>({
      query: (body) => ({
        url: '/signOffer',
        method: 'post',
        body,
      }),
    }),
    makeCollectionOffer: builder.mutation({
      query: (body) => ({
        url: '/makeCollectionOffer',
        method: 'post',
        body,
      }),
    }),
    makeItemOffer: builder.mutation({
      query: (body) => ({
        url: '/makeOffer',
        method: 'post',
        body,
      }),
    }),
    cancelCollectionOffer: builder.mutation({
      query: (body) => ({
        url: '/cancelCollectionOffer',
        method: 'post',
        body,
      }),
    }),
    cancelItemOffer: builder.mutation({
      query: (body) => ({
        url: '/cancelOffer',
        method: 'post',
        body,
      }),
    }),
    approveItemOffer: builder.mutation({
      query: (body) => ({
        url: '/approveOffer',
        method: 'post',
        body,
      }),
    }),
    deleteActivity: builder.mutation({
      query: (_id: string) => ({
        url: `/${_id}`,
        method: 'delete',
      }),
    }),
  }),
});

export const {
  useGetActivitiesQuery,
  useListForSaleMutation,
  useCancelListForSaleMutation,
  useBuyNowMutation,
  useSignOfferMutation,
  useMakeCollectionOfferMutation,
  useMakeItemOfferMutation,
  useCancelItemOfferMutation,
  useCancelCollectionOfferMutation,
  useApproveItemOfferMutation,
  useDeleteActivityMutation,
} = activityApi;
