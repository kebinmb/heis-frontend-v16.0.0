import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { UserArchiveState } from './archives-user-state-manager/archives-users.reducer';
import { ArchiveState } from './archives-state-manager/archives.reducer';
import { ArchiveService } from './archive.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { loadArchiveList } from './archives-state-manager/archives.actions';
import { selectArchive } from './archives-state-manager/archives.selector';
import { loadUserArchiveList } from './archives-user-state-manager/archives-users.actions';
import { selectUserList } from './archives-user-state-manager/archives-users.selector';
import { DocumentDetailsModalComponent } from './document-details-modal/document-details-modal.component';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  @ViewChild('paginatorArchives', { static: true }) paginatorArchives: MatPaginator;
  @ViewChild(MatSort) sortArchives:MatSort;
  

  displayedColumnsArchives: string[] = [
    'documentNumber',
    'type',
    'userNameSender',
    'userName',
    'subject',
    'timestamp',
  ];

  archivesArray$: Observable<any[]>;
  archives: any[];

  userListArray$: Observable<any[]>;
  users: any[];

  finalArchivesArray: any[];

  dataSourceArchives: MatTableDataSource<any>;

  selectedMonth: string;
  selectedYear: number;
  months = [
    { value: '01', viewValue: 'January' },
    { value: '02', viewValue: 'February' },
    { value: '03', viewValue: 'March' },
    { value: '04', viewValue: 'April' },
    { value: '05', viewValue: 'May' },
    { value: '06', viewValue: 'June' },
    { value: '07', viewValue: 'July' },
    { value: '08', viewValue: 'August' },
    { value: '09', viewValue: 'September' },
    { value: '10', viewValue: 'October' },
    { value: '11', viewValue: 'November' },
    { value: '12', viewValue: 'December' },
  ];
  years: number[] = [];
  isLoading: boolean = false;

  constructor(
    private store: Store<{ userList: UserArchiveState; archives: ArchiveState }>,public dialog: MatDialog, private archivesService:ArchiveService
  ) {
    this.archivesArray$ = this.store.pipe(select(selectArchive));
    this.userListArray$ = this.store.pipe(select(selectUserList));
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit() {
    this.store.dispatch(loadUserArchiveList());
    this.store.dispatch(loadArchiveList());
   
    this.loadArchivesWithReceiver();
  }
  openDialog(document: any): void {
    const dialogRef = this.dialog.open(DocumentDetailsModalComponent, {
      width: '80vw', // Set the width to 80% of the viewport width
      maxWidth: '95vw', // Set the maximum width to 90% of the viewport width
      maxHeight: '100vh', // Set the maximum height to 90% of the viewport height
      height: '80vh', // Set the height to 70% of the viewport height
      data:document
    });
  }

  loadArchivesWithReceiver() {
    this.isLoading = true;
    this.userListArray$
      .pipe(
        switchMap((users) => {
          this.users = users;
          return this.archivesArray$;
        })
      )
      .subscribe(
        (archives) => {
          this.archives = archives;
          this.finalArchivesArray = this.archives.map((archive) => {
            const user = this.users.find(
              (user) => user.userId.toString() === archive.attention
            );
            const sender = this.users.find(
              (sender) => sender.userId.toString() === archive.from
            );
  
            const receiverNames = archive.attention
              ? archive.attention.split(',').map((att: string) => {
                  const receiver = this.users.find(
                    (user) => user.userId.toString() === att.trim()
                  );
                  return receiver ? receiver.name : 'Unknown Receiver';
                })
              : [];
  
            return {
              ...archive,
              userName: user ? user.name : 'Unknown User',
              userNameSender: sender ? sender.name : 'Unknown Sender',
              receiverNames: receiverNames // Array of receiver names
            };
          });
          console.log("Final:",this.finalArchivesArray)
          this.dataSourceArchives = new MatTableDataSource(this.finalArchivesArray);
          this.dataSourceArchives.sort = this.sortArchives;
          this.dataSourceArchives.paginator = this.paginatorArchives;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error loading data:', error);
          this.isLoading = false;
        }
      );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceArchives.filter = filterValue.trim().toLowerCase();
  }

  onMonthChange(month: string) {
    this.selectedMonth = month;
    this.filterData();
  }

  onYearChange(year: number) {
    this.selectedYear = year;
    this.filterData();
  }

  filterData() {
    if (this.selectedMonth && this.selectedYear) {
      this.dataSourceArchives.data = this.finalArchivesArray.filter((archive) => {
        const date = new Date(archive.timestamp);
        return (
          date.getMonth() + 1 === parseInt(this.selectedMonth) &&
          date.getFullYear() === this.selectedYear
        );
      });
    } else {
      this.dataSourceArchives.data = this.finalArchivesArray;
    }
  }

  
}
