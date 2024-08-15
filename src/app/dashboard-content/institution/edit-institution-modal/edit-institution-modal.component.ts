import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InstitutionService } from '../institution.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-institution-modal',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,MatDialogModule,ReactiveFormsModule,FormsModule,MatInputModule,MatOptionModule,MatSelectModule,MatButtonModule],
  templateUrl: './edit-institution-modal.component.html',
  styleUrls: ['./edit-institution-modal.component.css']
})
export class EditInstitutionModalComponent implements OnInit {
  institution: any;
  userArray: any[];

  constructor(
    public dialogRef: MatDialogRef<EditInstitutionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private institutionService: InstitutionService,
    private snackBar: MatSnackBar
  ) {
    this.institution = { ...data };
    this.userArray = data.userArray; 
  }

  ngOnInit(): void {
    // console.log("Modal Data:", this.institution);
    // console.log("Department Id:", this.institution.department?.departmentId);
  }

  onSubmit(): void {
    if (this.institution.departmentCode && this.institution.departmentTitle && this.institution.emailReceiver) {
      const updatedDepartment = {
        departmentCode: this.institution.departmentCode,
        departmentTitle: this.institution.departmentTitle,
        emailReceiver: this.institution.emailReceiver,
        departmentId: this.institution.department?.departmentId // Ensure departmentId is present
      };

      this.institutionService.editDepartmentDetails(updatedDepartment.departmentId, updatedDepartment).subscribe(
        (response: any) => {
          const snackBarRef = this.snackBar.open('Department updated successfully!', 'Close', {
            duration: 3000,
          });

          // Execute window.location.reload() after the snackbar is dismissed
          snackBarRef.afterDismissed().subscribe(() => {
            window.location.reload(); // Refresh the page
          });

          this.dialogRef.close(response);
        },
        (error) => {
          console.error('Error updating department', error);
          this.snackBar.open('Error updating department. Please try again.', 'Close', {
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
}

