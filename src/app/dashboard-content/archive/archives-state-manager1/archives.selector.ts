// archives.selector.ts
import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ArchiveState } from "./archives.reducer";

export const selectArchiveState = createFeatureSelector<ArchiveState>('archives');

export const selectArchive = createSelector(selectArchiveState, (state: ArchiveState) => state.archives);
export const selectArchiveLoading = createSelector(selectArchiveState, (state: ArchiveState) => state.loading);
export const selectArchiveError = createSelector(selectArchiveState, (state: ArchiveState) => state.error);

// New selector to check if archives are loaded
export const selectArchivesLoaded = createSelector(
  selectArchiveState,
  (state: ArchiveState) => state.loaded
);
