import { configureStore } from '@reduxjs/toolkit';
import { activityApi } from 'services/activity';
import { collectionApi } from 'services/collection';
import { itemApi } from 'services/item';
import { ownerApi } from 'services/owner';
import { rewardApi } from 'services/reward';
import { searchApi } from 'services/search';
import application from 'state/application/reducer';
import lists from 'state/lists/reducer';
import multicall from 'state/multicall/reducer';
import user from 'state/user/reducer';

export const store = configureStore({
  reducer: {
    application,
    multicall,
    user,
    lists,
    [collectionApi.reducerPath]: collectionApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    [ownerApi.reducerPath]: ownerApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [activityApi.reducerPath]: activityApi.reducer,
    [rewardApi.reducerPath]: rewardApi.reducer,
  },
  // adding the api middleware enables caching, invalidation, polling and other features of `rtk-query`
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      collectionApi.middleware,
      itemApi.middleware,
      ownerApi.middleware,
      searchApi.middleware,
      activityApi.middleware,
      rewardApi.middleware
    ),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
