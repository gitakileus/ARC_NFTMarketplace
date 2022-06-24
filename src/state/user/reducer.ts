import { loginUser, logoutUser, setUser, setUserProfileImage } from './actions';
import { createReducer } from '@reduxjs/toolkit';
import { IPerson } from 'interfaces/IPerson';

export interface UserState {
  isAuthenticated: boolean;
  user: IPerson;
}

export const initialState: UserState = {
  isAuthenticated: false,
  user: {} as IPerson,
};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setUser, (state, { payload }) => {
      state.user = payload;
    })
    .addCase(setUserProfileImage, (state, { payload }) => {
      state.user.photoUrl = payload;
    })
    .addCase(loginUser, (state, action) => {
      state.isAuthenticated = true;
    })
    .addCase(logoutUser, (state, action) => {
      state.isAuthenticated = false;
    })
);
