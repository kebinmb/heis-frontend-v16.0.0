import { createAction, props } from "@ngrx/store";

export const loadUserArchiveList = createAction('[Users in Archive] Load User List');

export const loadUserArchiveListSuccess = createAction('[Users in Archive] Load User List Success',
    props<{ userList: any[] }>()
);

export const loadUserArchiveListFailure = createAction('[Users in Archive] Load User List Failure',
    props<{ error: any }>()
);