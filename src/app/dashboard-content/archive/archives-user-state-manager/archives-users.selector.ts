import { createSelector,createFeatureSelector, select } from "@ngrx/store";
import { UserArchiveState } from "./archives-users.reducer";

export const selectUserArchiveState = createFeatureSelector<UserArchiveState>('user');

export const selectUserList = createSelector(
    selectUserArchiveState,
    (state:UserArchiveState)=>state.userList
);

export const selectUserListSuccess = createSelector(
    selectUserArchiveState,
    (state:UserArchiveState)=> state.loading
);

export const selectUserListFailure = createSelector(
    selectUserArchiveState,
    (state:UserArchiveState)=>state.error
);