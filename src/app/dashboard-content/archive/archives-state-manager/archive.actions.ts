// archive.actions.ts
import { createAction, props } from '@ngrx/store';

export const loadUserArchiveList = createAction('[Archive] Load User List');
export const loadDocumentArchiveList = createAction('[Archive] Load Document List');

export const loadUserArchiveListSuccess = createAction(
  '[Archive] Load User List Success',
  props<{ users: any[] }>()
);

export const loadDocumentArchiveListSuccess = createAction(
  '[Archive] Load Document List Success',
  props<{ documents: any[] }>()
);

export const loadUserArchiveListFailure = createAction(
  '[Archive] Load User List Failed',
  props<{ error: string }>()
);

export const loadDocumentArchiveListFailure = createAction(
  '[Archive] Load Document List Failed',
  props<{ error: string }>()
);

export const loadArchivesWithReceiverSuccess = createAction(
  '[Archive] Load Archives With Receiver Success',
  props<{ finalArchivesArray: any[] }>()
);

export const loadArchivesWithReceiverFailure = createAction(
  '[Archive] Load Archives With Receiver Failed',
  props<{ error: string }>()
);
