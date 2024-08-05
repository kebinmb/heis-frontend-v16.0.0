// archive.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as ArchiveActions from './archive.actions';
import { ArchiveState, initialState } from './archive.state';

export const archiveReducer = createReducer(
  initialState,
  on(ArchiveActions.loadUserArchiveList, (state) => ({
    ...state,
    loadingUserArchive: true,
    error: null
  })),
  on(ArchiveActions.loadDocumentArchiveList, (state) => ({
    ...state,
    loadingDocumentArchive: true,
    error: null
  })),
  on(ArchiveActions.loadUserArchiveListSuccess, (state, { users }) => ({
    ...state,
    userArchiveList: users,
    loadingUserArchive: false,
    error: null
  })),
  on(ArchiveActions.loadDocumentArchiveListSuccess, (state, { documents }) => ({
    ...state,
    documentArchiveList: documents,
    loadingDocumentArchive: false,
    error: null
  })),
  on(ArchiveActions.loadUserArchiveListFailure, (state, { error }) => ({
    ...state,
    loadingUserArchive: false,
    error
  })),
  on(ArchiveActions.loadDocumentArchiveListFailure, (state, { error }) => ({
    ...state,
    loadingDocumentArchive: false,
    error
  })),
  on(ArchiveActions.loadArchivesWithReceiverSuccess, (state, { finalArchivesArray }) => ({
    ...state,
    finalArchivesArray,
    loadingUserArchive: false,
    loadingDocumentArchive: false,
    error: null
  })),
  on(ArchiveActions.loadArchivesWithReceiverFailure, (state, { error }) => ({
    ...state,
    loadingUserArchive: false,
    loadingDocumentArchive: false,
    error
  }))
);
