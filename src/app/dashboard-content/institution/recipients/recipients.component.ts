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
import { EditRecipientsModalComponent } from '../edit-recipients-modal/edit-recipients-modal.component';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { InstitutionService } from '../institution.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@Component({
  selector: 'app-recipients',
  standalone: true,
  imports: [CommonModule,MatSnackBarModule, MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, ReactiveFormsModule, FormsModule, MatButtonModule],
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

  constructor(private snackBar: MatSnackBar,private institutionService:InstitutionService,public dialog: MatDialog, private store: Store<{ institutionList: InstitutionState, userInstitutionList: UserInstitutionState }>) {
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
      // console.log(this.finalInstitutionArray);
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
      this.options = finalArray;
      this.finalInstitutionArray = finalArray;
      // Uncomment these lines if you want to use the data source for a table
      this.dataSource.data = this.finalInstitutionArray;
      this.dataSource.paginator = this.paginatorUser;
      // console.log("Final Array:", this.finalInstitutionArray);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RecipientModalComponent, {
      width: '90vw',
      maxWidth: '600px', // Optional: set a max width if needed
      height: 'auto',
      maxHeight: '80vh',
      // data: this.options
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // Handle any result here
    });
  }
  openDialogEdit(user: any): void {
    const dialogRef = this.dialog.open(EditRecipientsModalComponent, {
      width: '500px',
      data: {
        userId: user.userId,       // Pass the selected user data
        userArray: this.userArray // Pass the user array
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // Handle any result here if needed
    });
  }


  
  deleteUser(userId: any) {
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'Are you sure you want to proceed?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        // console.log(userId);
        // Call the deleteDepartment method from the service
        this.institutionService.deleteUser(userId).subscribe({
          next: () => {
            // Show snackbar for successful deletion
            const snackBarRef = this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
  
            // Refresh data after snackbar is dismissed
            snackBarRef.afterDismissed().subscribe(() => {
              this.refreshData(); // Call refreshData after snackbar is dismissed
            });
          },
          error: (err) => {
            // Show snackbar for error
            this.snackBar.open('An error occurred while deleting the user. Please try again later.', 'Close', {
              duration: 5000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
            });
          }
        });
      }
    });
  }

  private refreshData(): void {
    this.loadUserInstitutionList();
    window.location.reload() // Reload the institutions data
  }






}
