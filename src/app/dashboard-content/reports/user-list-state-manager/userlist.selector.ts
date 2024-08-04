import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../user-list-state-manager/userlist.reducer';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserList = createSelector(
  selectUserState,
  (state: UserState) => state.userList
);

export const selectUserLoading = createSelector(
  selectUserState,
  (state: UserState) => state.loading
);

export const selectUserError = createSelector(
  selectUserState,
  (state: UserState) => state.error
);
