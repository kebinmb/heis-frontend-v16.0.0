import { Component, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest, of, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserArchiveState } from './archives-user-state-manager/archives-users.reducer';
import { ArchiveState } from './archives-state-manager1/archives.reducer';
import { ArchiveService } from './archive.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { loadArchiveList } from './archives-state-manager1/archives.actions';
import { selectArchive } from './archives-state-manager1/archives.selector';
import { loadUserArchiveList } from './archives-user-state-manager/archives-users.actions';
import { selectUserList } from './archives-user-state-manager/archives-users.selector';
import { DocumentDetailsModalComponent } from './document-details-modal/document-details-modal.component';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  @ViewChild('paginatorArchives', { static: true }) paginatorArchives: MatPaginator;
  @ViewChild(MatSort) sortArchives: MatSort;
  
  displayedColumnsArchives: string[] = ['documentNumber', 'type', 'userNameSender', 'userName', 'subject', 'timestamp'];
  archivesArray$: Observable<any[]>;
  userListArray$: Observable<any[]>;
  archives: any[] = [];
  users: any[] = [];
  finalArchivesArray: any[] = [];
  dataSourceArchives: MatTableDataSource<any>;
  selectedMonth: string;
  selectedYear: number;

  filteredTalisayArchives:any[] = [];
filteredBinalbaganArchives:any[] = [];
filteredAlijisArchives :any[] = [];
filteredFortuneTowneArchives:any[] = [];
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
    private store: Store<{ userList: UserArchiveState; archives: ArchiveState }>,
    public dialog: MatDialog,
    
  ) {
    this.archivesArray$ = this.store.pipe(select(selectArchive));
    this.userListArray$ = this.store.pipe(select(selectUserList));
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    ////console.log("load Data")
  
    combineLatest([this.userListArray$, this.archivesArray$]).pipe(
      switchMap(([users, archives]) => {
        if (users && users.length > 0) {
          this.users = users;
        } else {
          this.store.dispatch(loadUserArchiveList());
          this.store.dispatch(loadArchiveList());
        }
        if (archives && archives.length > 0) {
          this.archives = archives;
          this.finalArchivesArray = this.processArchivesAndCache();
        } else {
         
        }
        
        this.dataSourceArchives = new MatTableDataSource(this.finalArchivesArray);
        this.dataSourceArchives.paginator = this.paginatorArchives;
  
        // Return an observable that completes after a delay
        return timer(500).pipe( // 500 ms delay
          switchMap(() => of(this.finalArchivesArray))
        );
      })
    ).subscribe(
      () => {
        // Set isLoading to false after the delay
        this.isLoading = false;
        this.dataSourceArchives.sort = this.sortArchives;
        this.sortArchives.sort({ id: 'timestamp', start: 'desc', disableClear: true });
        
        
      },
      error => {
        console.error('Error loading data:', error);
        this.isLoading = false;
      }
    );
  }

  processArchivesAndCache() {
    const encryptedCampusValue = sessionStorage.getItem('campus');
    ////console.log("procees archive")
    // Decrypt the campus value
    const decryptedCampusValue = encryptedCampusValue
        ? CryptoJS.AES.decrypt(encryptedCampusValue, 'chmsu.edu.ph.secret-key.secret').toString(CryptoJS.enc.Utf8)
        : null;

    // Convert the decrypted value to a number
    const campusNumber = decryptedCampusValue ? Number(decryptedCampusValue) : null;

    ////console.log("Decrypted Campus Value:", campusNumber);

    if (campusNumber == null) {
        console.error("Invalid campus number");
        return [];
    }

    // Define a mapping of campus numbers to archive arrays
    const campusArchivesMap: { [key: number]: any[] } = {
        1: this.archives.filter(archive => archive.encoder === campusNumber),
        2: this.archives.filter(archive => archive.encoder === campusNumber),
        3: this.archives.filter(archive => archive.encoder === campusNumber),
        4: this.archives.filter(archive => archive.encoder === campusNumber),
    };

    // Get the filtered archives based on the campus number
    const filteredArchives = campusArchivesMap[campusNumber] || [];

    ////console.log("Filtered Archives:", filteredArchives);

    // Map the filtered archives to final archives
    const finalArchives = filteredArchives.map((archive) => {
        const user = this.users.find((user) => user.userId.toString() === archive.attention);
        const sender = this.users.find((sender) => sender.userId.toString() === archive.from);
        const receiverNames = archive.attention
            ? archive.attention.split(',').map((att: string) => {
                const receiver = this.users.find((user) => user.userId.toString() === att.trim());
                return receiver ? receiver.name : 'Unknown Receiver';
            }).filter((name: string) => name !== '').join(', ')
            : 'Unknown Receiver';

        return {
            ...archive,
            userName: user ? user.name : 'Unknown User',
            userNameSender: sender ? sender.name : 'Unknown Sender',
            receiverNames: receiverNames
        };

        
    });

    ////console.log("Final:", finalArchives);
    return finalArchives;
}
  

  openDialog(document: any): void {
    const dialogRef = this.dialog.open(DocumentDetailsModalComponent, {
      width: '80vw',
      maxWidth: '95vw',
      maxHeight: '100vh',
      height: '80vh',
      data: document
    });
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
