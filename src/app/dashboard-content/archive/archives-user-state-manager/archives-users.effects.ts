import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ArchiveService } from "../archive.service";
import { loadUserArchiveList, loadUserArchiveListFailure, loadUserArchiveListSuccess } from "./archives-users.actions";
import { catchError, map, mergeMap, of, tap } from "rxjs";

@Injectable()
export class UserArchiveEffects {
  private cache: any[] | null = null; // In-memory cache for user list

  loadUserArchiveList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserArchiveList),
      mergeMap(() => {
        if (this.cache) {
          // If cache exists, use cached data
          console.log('Using cached user list:', this.cache);
          return of(loadUserArchiveListSuccess({ userList: this.cache }));
        } else {
          // If no cache, fetch from service
          return this.archivesService.getUserList().pipe(
            tap(userList => {
              console.log('Users from Archive Effects:', userList);
              this.cache = userList; // Cache the fetched data
            }),
            map(userList => loadUserArchiveListSuccess({ userList })),
            catchError(error => {
              console.error('Error fetching user list in archive effects.', error);
              return of(loadUserArchiveListFailure({ error }));
            })
          );
        }
      })
    )
  );

  constructor(
    private actions$: Actions,
    private archivesService: ArchiveService
  ) {}
}
