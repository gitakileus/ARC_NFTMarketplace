import { createAction } from '@reduxjs/toolkit';
import { IPerson } from 'interfaces/IPerson';

export const setUser = createAction<IPerson>('user/set');
export const setUserProfileImage = createAction<string>('user/setProfileImage');
export const loginUser = createAction('user/login');
export const logoutUser = createAction('user/logout');
