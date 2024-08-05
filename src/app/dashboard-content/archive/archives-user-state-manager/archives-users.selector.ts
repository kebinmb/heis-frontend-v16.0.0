import { createSelector, createFeatureSelector } from "@ngrx/store";
import { UserArchiveState } from "./archives-users.reducer";

export const selectUserArchiveState = createFeatureSelector<UserArchiveState>('user');

export const selectUserList = createSelector(
    selectUserArchiveState,
    (state: UserArchiveState) => state.userList
);

export const selectUserListLoaded = createSelector(
    selectUserArchiveState,
    (state: UserArchiveState) => state.loaded
);
