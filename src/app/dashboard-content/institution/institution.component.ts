import { Component, ViewChild } from '@angular/core';
import { loadInstutionList,loadInstutionListFailure,loadInstutionListSuccess } from './department-list-state-manager/department-list.actions';
import { selectInstitutionList,selectInstitutionLoading,selectInstitutionError } from './department-list-state-manager/department-list.selector';
import { selectUserInstitutionList,selectUserInstitutionListFailure,selectUserInstitutionListLoading } from './user-institution-list-state-manager/institution-users.selector';
import { loadUserInstitutionList } from './user-institution-list-state-manager/institution-users.actions';
import { UserInstitutionState } from './user-institution-list-state-manager/institution-users.reducer';
import { InstitutionState } from './department-list-state-manager/department-list.reducer';
import { combineLatest, map, Observable, pipe, switchMap } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { InstitutionModalComponent } from './institution-modal/institution-modal.component';
import { MatButtonModule } from '@angular/material/button';
import { InstitutionService } from './institution.service';
import { EditInstitutionModalComponent } from './edit-institution-modal/edit-institution-modal.component';
import { ConfirmDialogComponent } from './confirmdialog/confirmdialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RecipientsComponent } from './recipients/recipients.component';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-institution',
  standalone: true,
  imports: [CommonModule,MatTabsModule,RecipientsComponent,MatPaginatorModule,MatTableModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatDialogModule,MatButtonModule],
  templateUrl: './institution.component.html',
  styleUrls: ['./institution.component.css']
})
export class InstitutionComponent {
institutionListsArray$: Observable<any[]>;
loadingInstitution$: Observable<boolean>;
errorInstitution$: Observable<any[]>;

userInstitutionListArray$: Observable<any[]>;
loadingUserInstitutionList$: Observable<boolean>;
errorUserInstitution$: Observable<any[]>;

institutionArray:any[];
finalInstitutionArray:any[];
userArray:any[];

dataSource = new MatTableDataSource<any>();
displayedColumns: string[] = ['departmentCode', 'departmentTitle', 'actions'];

options:any[];
@ViewChild(MatPaginator) paginator: MatPaginator;
constructor(private store:Store<{institutionList:InstitutionState, userInstitutionList:UserInstitutionState}>,public dialog: MatDialog,private institutionService:InstitutionService, private snackBar: MatSnackBar){

  this.institutionListsArray$ = this.store.pipe(select(selectInstitutionList));
  this.loadingInstitution$ = this.store.pipe(select(selectInstitutionLoading));
  this.errorInstitution$ = this.store.pipe(select(selectInstitutionError));

  this.userInstitutionListArray$ = this.store.pipe(select(selectUserInstitutionList));
  this.loadingUserInstitutionList$ = this.store.pipe(select(selectUserInstitutionListLoading));
  this.errorUserInstitution$ = this.store.pipe(select(selectUserInstitutionListFailure));

}

ngOnInit():void{
  this.loadInstitutionNamesList();
    this.store.dispatch(loadInstutionList());
    this.store.dispatch(loadUserInstitutionList());
    this.loadUserInstitutionList();
}
loadInstitutionNamesList(){
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
    this.dataSource.data = this.finalInstitutionArray;
    this.dataSource.paginator = this.paginator;
    // console.log(this.finalInstitutionArray)
  });
}

loadUserInstitutionList() {
  this.userInstitutionListArray$.subscribe(userInstitutionList => {
    this.userArray = userInstitutionList;
    // console.log('User Array:', this.userArray); // Log the array for debugging
   this.options = this.userArray.map(user=>({
    name:user.name,
    userId:user.userId
   }))
  });
}

openDialog(): void {
  const dialogRef = this.dialog.open(InstitutionModalComponent, {
    width: '500px',
    data: this.options
  });

  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed');
    // Handle any result here
  });
}
openDialogEdit(department: any): void {
  const dialogRef = this.dialog.open(EditInstitutionModalComponent, {
    width: '500px',
    data: {
      department,
      userArray: this.userArray // Pass the userArray within the data object
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    // console.log('The dialog was closed');
    // Handle any result here if needed
  });
}

deleteInstitution(departmentId: any) {
  // Open the confirmation dialog
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '500px',
    data: { message: 'Are you sure you want to delete this department?' }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'confirm') {
      // Call the deleteDepartment method from the service
      this.institutionService.deleteDepartment(departmentId).subscribe({
        next: () => {
          // Show snackbar for successful deletion
          const snackBarRef = this.snackBar.open('Department deleted successfully', 'Close', {
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
          this.snackBar.open('An error occurred while deleting the department. Please try again later.', 'Close', {
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
  this.loadInstitutionNamesList();
  
  window.location.reload() // Reload the institutions data
}

editDepartmentDetails(id: number, department: any, name:string): void {
  this.institutionService.editDepartmentDetails(id, department,name).subscribe(
    (response: any) => {
      // console.log('Department updated successfully', response);
      // Add any additional logic for success, like showing a success message
    },
    (error) => {
      console.error('Error updating department', error);
      // Add any additional logic for error, like showing an error message
    }
  );
}
}



