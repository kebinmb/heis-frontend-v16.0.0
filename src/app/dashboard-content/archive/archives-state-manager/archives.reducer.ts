import { createReducer, on } from "@ngrx/store";
import {
  loadArchiveList,
  loadArchivesListFailure,
  loadArchivesListSuccess,
} from "./archives.actions";



export interface ArchiveState {
  archives: any[];
  loading: boolean;
  error: any;
}

export const initialStateArchive: ArchiveState = { archives: [], loading: false, error: null };

const _archiveReducer = createReducer(
  initialStateArchive,
  on(loadArchiveList, state => ({ ...state, loading: true, error: null })),
  on(loadArchivesListSuccess, (state, { archives }) => ({ ...state, archives, loading: false })),
  on(loadArchivesListFailure, (state, { error }) => ({ ...state, error, loading: false }))
);



export function archiveReducer(state:any, action: any) {
  return _archiveReducer(state, action);
}
