// archives.reducer.ts
import { createReducer, on } from "@ngrx/store";
import {
  loadArchiveList,
  loadArchivesListSuccess,
  loadArchivesListFailure
} from "./archives.actions";

export interface ArchiveState {
  archives: any[];
  loading: boolean;
  error: any;
  loaded: boolean; // New property to indicate if data is loaded
}

export const initialStateArchive: ArchiveState = {
  archives: [],
  loading: false,
  error: null,
  loaded: false // Initial state
};

const _archiveReducer = createReducer(
  initialStateArchive,
  on(loadArchiveList, state => ({ ...state, loading: true, error: null })),
  on(loadArchivesListSuccess, (state, { archives }) => ({
    ...state,
    archives,
    loading: false,
    loaded: true // Mark data as loaded
  })),
  on(loadArchivesListFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false
  }))
);

export function archiveReducer(state: any, action: any) {
  return _archiveReducer(state, action);
}
