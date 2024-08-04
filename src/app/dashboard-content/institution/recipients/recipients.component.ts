import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { loadInstutionList, loadInstutionListFailure, loadInstutionListSuccess } from '../department-list-state-manager/department-list.actions';
import { selectInstitutionList, selectInstitutionError, selectInstitutionLoading } from '../department-list-state-manager/department-list.selector';
import { loadUserInstitutionList, loadUserInstitutionListFailure, loadUserInstitutionListSuccess } from '../user-institution-list-state-manager/institution-users.actions';
import { combineLatest, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { select, Store } from '@ngrx/store';
import { InstitutionState } from '../department-list-state-manager/department-list.reducer';
import { UserInstitutionState } from '../user-institution-list-state-manager/institution-users.reducer';
import { selectUserInstitutionList, selectUserInstitutionListFailure, selectUserInstitutionListLoading } from '../user-institution-list-state-manager/institution-users.selector';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { RecipientModalComponent } from '../recipient-modal/recipient-modal.component';


@Component({
  selector: 'app-recipients',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, ReactiveFormsModule, FormsModule, MatButtonModule],
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.css']
})
export class RecipientsComponent {


  institutionListsArray$: Observable<any[]>;
  loadingInstitution$: Observable<boolean>;
  errorInstitution$: Observable<any[]>;

  userInstitutionListArray$: Observable<any[]>;
  loadingUserInstitutionList$: Observable<boolean>;
  errorUserInstitution$: Observable<any[]>;

  finalInstitutionArray: any[] = [];
  userArray: any[] = [];
  options: any[] = [];

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'designation', 'department', 'email', 'campus', 'actions'];

  @ViewChild(MatPaginator) paginatorUser: MatPaginator;

  constructor(public dialog: MatDialog, private store: Store<{ institutionList: InstitutionState, userInstitutionList: UserInstitutionState }>) {
    this.institutionListsArray$ = this.store.pipe(select(selectInstitutionList));
    this.loadingInstitution$ = this.store.pipe(select(selectInstitutionLoading));
    this.errorInstitution$ = this.store.pipe(select(selectInstitutionError));

    this.userInstitutionListArray$ = this.store.pipe(select(selectUserInstitutionList));
    this.loadingUserInstitutionList$ = this.store.pipe(select(selectUserInstitutionListLoading));
    this.errorUserInstitution$ = this.store.pipe(select(selectUserInstitutionListFailure));
  }

  ngOnInit(): void {
    this.loadInstitutionNamesList();
    this.loadUserInstitutionList();
  }

  loadInstitutionNamesList() {
    combineLatest([this.institutionListsArray$, this.userInstitutionListArray$]).pipe(
      map(([institutions, users]) => {
        return institutions.map(institution => {
          const user = users.find(user => user.userId === institution.emailReceiver);
          return {
            ...institution,
            emailReceiverName: user ? user.name : null
          };
        });
      })
    ).subscribe(finalArray => {
      this.finalInstitutionArray = finalArray;
      // this.dataSource.data = this.finalInstitutionArray;
      // this.dataSource.paginator = this.paginatorUser;
      console.log(this.finalInstitutionArray);
    });
  }

  loadUserInstitutionList() {
    combineLatest([this.institutionListsArray$, this.userInstitutionListArray$]).pipe(
      map(([institutions, users]) => {
        return users.map(user => {
          // Find the corresponding institution based on departmentId
          const institution = institutions.find(inst => inst.departmentId === user.departmentId);

          return {
            ...user,
            departmentName: institution ? institution.departmentTitle : "Unknown Institution" // Assign the institution name
          };
        });
      })
    ).subscribe(finalArray => {
      this.finalInstitutionArray = finalArray;
      // Uncomment these lines if you want to use the data source for a table
      this.dataSource.data = this.finalInstitutionArray;
      this.dataSource.paginator = this.paginatorUser;
      console.log("Final Array:", this.finalInstitutionArray);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RecipientModalComponent, {
      width: '90vw',
      maxWidth: '600px', // Optional: set a max width if needed
      height: 'auto',
      maxHeight: '80vh',
      data: this.options
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any result here
    });
  }
  // openDialogEdit(department: any): void {
  //   const dialogRef = this.dialog.open(EditInstitutionModalComponent, {
  //     width: '500px',
  //     data: {
  //       department,
  //       userArray: this.userArray // Pass the userArray within the data object
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     // Handle any result here if needed
  //   });
  // }






}
