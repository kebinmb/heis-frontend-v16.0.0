// archive.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ArchiveState } from './archive.state';

export const selectArchiveState = createFeatureSelector<ArchiveState>('archive');

export const selectUserArchiveList = createSelector(
  selectArchiveState,
  (state: ArchiveState) => state.userArchiveList
);

export const selectDocumentArchiveList = createSelector(
  selectArchiveState,
  (state: ArchiveState) => state.documentArchiveList
);

export const selectLoadingUserArchive = createSelector(
  selectArchiveState,
  (state: ArchiveState) => state.loadingUserArchive
);

export const selectFinalArchivesArray = createSelector(
  selectArchiveState,
  (state: ArchiveState) => state.finalArchivesArray
);
