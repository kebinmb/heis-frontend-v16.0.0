import { createReducer,on } from "@ngrx/store";
import { loadUserArchiveList,loadUserArchiveListFailure,loadUserArchiveListSuccess} from "./archives-users.actions";

export interface UserArchiveState{
    userList:any[];
    loading:boolean;
    error:any
}

export const initialState:UserArchiveState = {
    userList:[],
    loading:false,
    error:null
}

const _userArchiveReducer = createReducer(
    initialState,
    on(loadUserArchiveList,state=>
    ({
        ...state,
        loading:false,
        error:null
    })
    ),
    on(loadUserArchiveListSuccess,(state,{userList})=>
    ({
        ...state,
        userList,
        loading:false
    })
    ),
    on(loadUserArchiveListFailure,(state,{error})=>
    ({
        ...state,
        error,
        loading:false
    }))
);

export function userArchiveReducer(state:any,action:any){
    return _userArchiveReducer(state,action);
}
