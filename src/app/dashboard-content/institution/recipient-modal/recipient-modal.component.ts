import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-recipient-modal',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatCardModule],
  templateUrl: './recipient-modal.component.html',
  styleUrls: ['./recipient-modal.component.css']
})
export class RecipientModalComponent {
  recipientForm: FormGroup;
  options: any[] = [];
  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<RecipientModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private snackBar: MatSnackBar) {
    
    this.recipientForm = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      departmentId: ['', Validators.required],
      campus: ['', Validators.required],
      companyName: ['', Validators.required],
      accessLevel: ['', Validators.required],
      employeeType: ['', Validators.required],
      permanence: ['', Validators.required],
      userType: ['', Validators.required],
      emailReceiver: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.options = data || [];
  }
  addNewUser() {
    if (this.recipientForm.valid) {
      // Extract values from the form
      const formValues = this.recipientForm.value;

      // For demonstration, log form values
      console.log('Form Values:', formValues);

      // You can now use these values to submit to a backend or perform other actions
      // Example: this.userService.addUser(formValues).subscribe(response => {...});
    } else {
      // If the form is not valid, mark all fields as touched to show validation errors
      this.recipientForm.markAllAsTouched();
    }
  }
}
