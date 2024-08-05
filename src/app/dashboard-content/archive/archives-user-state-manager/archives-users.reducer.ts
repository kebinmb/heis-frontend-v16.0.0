import { createReducer, on } from "@ngrx/store";
import { loadUserArchiveList, loadUserArchiveListFailure, loadUserArchiveListSuccess } from "./archives-users.actions";

export interface UserArchiveState {
    userList: any[];
    loading: boolean;
    error: any;
    loaded: boolean; // Add a flag to indicate if the user list has been loaded
}

export const initialState: UserArchiveState = {
    userList: [],
    loading: false,
    error: null,
    loaded: false // Initial state
}

const _userArchiveReducer = createReducer(
    initialState,
    on(loadUserArchiveList, state => ({
        ...state,
        loading: true,
        error: null
    })),
    on(loadUserArchiveListSuccess, (state, { userList }) => ({
        ...state,
        userList,
        loading: false,
        loaded: true // Set loaded to true when data is successfully fetched
    })),
    on(loadUserArchiveListFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    }))
);

export function userArchiveReducer(state: any, action: any) {
    return _userArchiveReducer(state, action);
}
