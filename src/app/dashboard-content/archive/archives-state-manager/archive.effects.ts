// archive.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import * as ArchiveActions from './archive.actions';
import * as ArchiveSelectors from './archive.selector';
import { ArchiveService } from '../archive.service';
import { ArchiveState } from './archive.state';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class ArchiveEffects {
  constructor(
    private actions$: Actions,
    private archiveService: ArchiveService,
    private store: Store<ArchiveState>
  ) {}

  loadUserArchiveList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArchiveActions.loadUserArchiveList),
      withLatestFrom(
        this.store.pipe(select(ArchiveSelectors.selectUserArchiveList))
      ),
      mergeMap(([action, userList]) => {
        if (userList.length > 0) {
          // User list is already loaded, return success action with cached data
          return of(
            ArchiveActions.loadUserArchiveListSuccess({ users: userList })
          );
        } else {
          return this.archiveService.getUserList().pipe(
            map((users) =>
              ArchiveActions.loadUserArchiveListSuccess({ users })
            ),
            catchError((error) =>
              of(ArchiveActions.loadUserArchiveListFailure({ error }))
            )
          );
        }
      })
    )
  );

  loadDocumentArchiveList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ArchiveActions.loadDocumentArchiveList),
      withLatestFrom(this.store.pipe(select(ArchiveSelectors.selectDocumentArchiveList))),
      mergeMap(([action, documentList]) => {
        // Decrypt `name` from `sessionStorage`
        const encryptedName = sessionStorage.getItem('username');
        let decryptedName = '';
        ////console.log("Encrypted Name:",encryptedName)
        if (encryptedName) {
          const bytes = CryptoJS.AES.decrypt(encryptedName, 'chmsu.edu.ph.secret-key.secret');
          decryptedName = bytes.toString(CryptoJS.enc.Utf8);
          ////console.log(decryptedName);
        }

        if (documentList.length > 0) {
          // Document list is already loaded, return success action with cached data
          return of(ArchiveActions.loadDocumentArchiveListSuccess({ documents: documentList }));
        } else {
          return this.archiveService.getArchives(decryptedName).pipe(
            // Pass `decryptedName` to `getArchives()`
            map(documents => ArchiveActions.loadDocumentArchiveListSuccess({ documents })),
            catchError(error => of(ArchiveActions.loadDocumentArchiveListFailure({ error })))
          );
        }
      })
    )
  );


  loadArchivesWithReceiver$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        ArchiveActions.loadUserArchiveListSuccess,
        ArchiveActions.loadDocumentArchiveListSuccess
      ),
      withLatestFrom(
        this.store.pipe(select(ArchiveSelectors.selectUserArchiveList)),
        this.store.pipe(select(ArchiveSelectors.selectDocumentArchiveList))
      ),
      switchMap(([action, users, documents]) => {
        const finalArchivesArray = documents.map((archive) => {
          const user = users.find(
            (user) => user.userId.toString() === archive.attention
          );
          const sender = users.find(
            (sender) => sender.userId.toString() === archive.from
          );

          const receiverNames = archive.attention
            ? archive.attention.split(',').map((att: string) => {
                const receiver = users.find(
                  (user) => user.userId.toString() === att.trim()
                );
                return receiver ? receiver.name : 'Unknown Receiver';
              })
            : [];

          return {
            ...archive,
            userName: user ? user.name : 'Unknown User',
            userNameSender: sender ? sender.name : 'Unknown Sender',
            receiverNames: receiverNames, // Array of receiver names
          };
        });

        return of(
          ArchiveActions.loadArchivesWithReceiverSuccess({ finalArchivesArray })
        );
      }),
      catchError((error) =>
        of(ArchiveActions.loadArchivesWithReceiverFailure({ error }))
      )
    )
  );
}
