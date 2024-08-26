import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InstitutionService } from '../institution.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-recipients-modal',
  templateUrl: './edit-recipients-modal.component.html',
  styleUrls: ['./edit-recipients-modal.component.css']
})
export class EditRecipientsModalComponent implements OnInit {
  user: any;

  constructor(
    public dialogRef: MatDialogRef<EditRecipientsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private institutionService: InstitutionService,
    private snackBar: MatSnackBar
  ) {
    this.user = { ...data }; // Ensure user data is correctly initialized
  }

  ngOnInit(): void {
    // console.log("Modal Data:", this.user.userId);
  }

  onSubmit(): void {
    if (this.user && this.user.userId && this.user.name && this.user.email) {
      const updatedUser = {
        userId: this.user.userId,
        name: this.user.name,
        designation: this.user.designation,
        departmentId: this.user.departmentId,
        campus: this.user.campus,
        companyName: this.user.companyName,
        accessLevel: this.user.accessLevel,
        employeeType: this.user.employeeType,
        permanent: this.user.permanent,
        emailReceiver: 1,
        email: this.user.email
      };

      this.institutionService.editUserDetails(updatedUser.userId, updatedUser).subscribe(
        (response: any) => {
          const snackBarRef = this.snackBar.open('User updated successfully!', 'Close', {
            duration: 3000,
          });

          // Execute window.location.reload() after the snackbar is dismissed
          snackBarRef.afterDismissed().subscribe(() => {
            window.location.reload(); // Refresh the page
          });

          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error updating user', error);
          this.snackBar.open('Error updating user. Please try again.', 'Close', {
            duration: 3000,
          });
        }
      );
    } else {
      this.snackBar.open('Please fill out all required fields.', 'Close', {
        duration: 3000,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isEmailValid(): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(this.user.email);
  }

}
