import { Injectable } from "@angular/core";
import { loadArchiveList, loadArchivesListSuccess, loadArchivesListFailure } from './archives.actions';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ArchiveService } from "../archive.service";
import { map, mergeMap, catchError, of } from "rxjs";
import * as CryptoJS from 'crypto-js';

@Injectable()
export class ArchiveEffects {
    private cachedArchives: any[] | null = null; // Cache for archives

    loadArchiveList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadArchiveList),
            mergeMap(() => {
                // Decrypt the `name` from sessionStorage
        const encryptedName = sessionStorage.getItem('username');
        let decryptedName = '';
        if (encryptedName) {
          const bytes = CryptoJS.AES.decrypt(encryptedName, 'chmsu.edu.ph.secret-key.secret');
          decryptedName = bytes.toString(CryptoJS.enc.Utf8);
        }
                if (this.cachedArchives) {
                    
                    // Use cached data if available
                    ////console.log('Using cached archives:', this.cachedArchives);
                    return of(loadArchivesListSuccess({ archives: this.cachedArchives }));
                } else {
                    // Fetch data from the service and cache it
                    return this.archivesService.getArchives(decryptedName).pipe(
                        map(archives => {
                            ////console.log('Fetched archives:', archives);
                            this.cachedArchives = archives; // Cache the fetched data
                            return loadArchivesListSuccess({ archives });
                        }),
                        catchError(error => {
                            console.error('Error fetching archives:', error);
                            return of(loadArchivesListFailure({ error }));
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
