import { Component } from '@angular/core';
import { LogsService } from '../logs/logs.service';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { UserLogsState } from '../logs/logs-user-state-manager/logs-user.reducer';
import { selectUserLogsFailure, selectUserLogsList, selectUserLogsLoading } from '../logs/logs-user-state-manager/logs-user.selector';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { loadUserLogsList } from '../logs/logs-user-state-manager/logs-user.actions';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-logs-document',
  templateUrl: './logs-document.component.html',
  styleUrls: ['./logs-document.component.css']
})
export class LogsDocumentComponent {
  logs: any[] = [];
  currentDate: string;
  userArray: any[] = [];
  finalLogsArray: any[] = [];
  userLogsListArray$: Observable<any[]>;
  loadingUserLogsList$: Observable<boolean>;
  errorUserLogsList$: Observable<any[]>;
displayedColumns: string[] = ['date', 'userName', 'action'];
  constructor(private store: Store<{ userLogsList: UserLogsState }>, private logsService: LogsService) {
    this.userLogsListArray$ = this.store.pipe(select(selectUserLogsList));
    this.loadingUserLogsList$ = this.store.pipe(select(selectUserLogsLoading));
    this.errorUserLogsList$ = this.store.pipe(select(selectUserLogsFailure));
  }

  ngOnInit() {
    this.store.dispatch(loadUserLogsList());
    this.currentDate = this.getCurrentDateString();

    const campus = sessionStorage.getItem('campus');
    let decryptedCampus: string | null = null;

    if (campus) {
      try {
        const bytes = CryptoJS.AES.decrypt(campus, 'chmsu.edu.ph.secret-key.secret');
        decryptedCampus = bytes.toString(CryptoJS.enc.Utf8);

        // Optionally check if decryptedCampus is empty or invalid
        if (!decryptedCampus) {
          console.error('Decryption resulted in an empty value.');
        }
      } catch (error) {
        console.error('Error during decryption:', error);
      }
    } else {
      console.warn('No campus data found in sessionStorage.');
    }

    console.log('Decrypted Campus:', decryptedCampus);

    // Use the decrypted value or handle null case
    this.loadDocumentProcessingLogs(this.currentDate, decryptedCampus);
  }

  loadDocumentProcessingLogs(date: string, campus: any | null) {
    this.logsService.getDocumentLogs(date, campus).subscribe({
      next: (response) => {
        this.logs = response;
        console.log("Document Logs:",this.logs);
        this.userLogsListArray$.subscribe(userList => {
          this.userArray = userList;
          // Assuming userList is an array of users and you want to find users matching log userId
          this.finalLogsArray = this.logs.map(log => {
            const user = this.userArray.find(user => user.userId === log.userId);
            return {
              ...log,
              userName: user ? user.name : 'Unknown'
            };
          });
        });
        console.log("Final Logs:",this.finalLogsArray)
      },
      error: (error) => {
        console.error(error);
      }
    });

   
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    if (event.value) {
      this.currentDate = this.formatDate(event.value);
      const campus = sessionStorage.getItem('campus');
      let decryptedCampus: string | null = null;

      if (campus) {
        try {
          const bytes = CryptoJS.AES.decrypt(campus, 'chmsu.edu.ph.secret-key.secret');
          decryptedCampus = bytes.toString(CryptoJS.enc.Utf8);
          
          if (!decryptedCampus) {
            console.error('Decryption resulted in an empty value.');
          }
        } catch (error) {
          console.error('Error during decryption:', error);
        }
      } else {
        console.warn('No campus data found in sessionStorage.');
      }

      console.log('Decrypted Campus:', decryptedCampus);
      this.loadDocumentProcessingLogs(this.currentDate, decryptedCampus);
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  getCurrentDateString(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
}
