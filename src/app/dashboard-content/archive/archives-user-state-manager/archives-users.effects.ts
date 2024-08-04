import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ArchiveService } from "../archive.service";
import { loadUserArchiveList, loadUserArchiveListFailure, loadUserArchiveListSuccess } from "./archives-users.actions";
import { catchError, map, mergeMap, of } from "rxjs";


@Injectable()
export class UserArchiveEffects{
    loadUserArchiveListSuccess$ = createEffect(()=>
    this.actions$.pipe(
        ofType(loadUserArchiveList),
        mergeMap(()=>
        this.archivesService.getUserList().pipe(
            map(userList=>{
                console.log('Users from Archive Effects:',userList);
                return loadUserArchiveListSuccess({userList});
            }),
            catchError(error=>{
                console.error('Error fetching user list in archive effects.',error);
                return of(loadUserArchiveListFailure({error}));
            })
        ))
    ))

    constructor(private actions$:Actions,
        private archivesService:ArchiveService
    ){}
}