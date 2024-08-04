import { Injectable } from "@angular/core";
import { loadArchiveList, loadArchivesListSuccess } from './archives.actions';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ArchiveService } from "../archive.service";
import { map, mergeMap } from "rxjs";

@Injectable()

export class ArchiveEffects{
    loadArchiveList$ = createEffect(()=>
        this.actions$.pipe(
            ofType(loadArchiveList),
            mergeMap(()=>
            this.archivesService.getArchives().pipe(
                map(archives=>{
                    console.log('Archives:',archives);
                    return loadArchivesListSuccess({archives});
                })
            ))
        ));
        
    

   

    constructor(
        private actions$:Actions,
        private archivesService:ArchiveService
    ){}
}

