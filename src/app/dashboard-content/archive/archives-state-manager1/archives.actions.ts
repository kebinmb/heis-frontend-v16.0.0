import { createAction,props } from "@ngrx/store";

export const loadArchiveList = createAction('[Archives] Load Archives',props<{name:string}>);

export const loadArchivesListSuccess = createAction('[Archives] Load Archives Success',props<{archives:any[]}>());

export const loadArchivesListFailure = createAction('[Archives] Load Archives Failure',props<{error:any}>());

