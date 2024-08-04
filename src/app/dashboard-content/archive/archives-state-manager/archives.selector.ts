import { createFeatureSelector,createSelector, select } from "@ngrx/store";
import { ArchiveState } from "./archives.reducer";






export const selectArchiveState = createFeatureSelector<ArchiveState>('archives');

export const selectArchive = createSelector(selectArchiveState,(state:ArchiveState)=>state.archives);
export const selectArchiveLoading = createSelector(selectArchiveState,(state:ArchiveState)=>state.loading);
export const selectArchiveError = createSelector(selectArchiveState,(state:ArchiveState)=>state.error);

