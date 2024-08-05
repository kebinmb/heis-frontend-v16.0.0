// archive.state.ts
export interface ArchiveState {
  userArchiveList: any[];
  documentArchiveList: any[];
  finalArchivesArray: any[];
  loadingUserArchive: boolean;
  loadingDocumentArchive: boolean;
  error: string | null;
}

export const initialState: ArchiveState = {
  userArchiveList: [],
  documentArchiveList: [],
  finalArchivesArray: [],
  loadingUserArchive: false,
  loadingDocumentArchive: false,
  error: null
};
