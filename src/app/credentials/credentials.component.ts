import { Component } from '@angular/core';
import { CredentialsService } from './credentials.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { catchError, of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css'],
})
export class CredentialsComponent {
  userInputPassword: string;
  decryptedName:string|null;
  passwordForm: FormGroup;
  currentPassword: string|null; //From API
  constructor(private credentialsService: CredentialsService,private fb: FormBuilder,private snackBar:MatSnackBar) {}

  ngOnInit() {
    const name = sessionStorage.getItem('name');
    if (name) {
      try {
        const bytes = CryptoJS.AES.decrypt(name, 'chmsu.edu.ph.secret-key.secret');
        this.decryptedName = bytes.toString(CryptoJS.enc.Utf8);
      } catch (error) {
        console.error('Error during decryption:', error);
      }
    }

    if (this.decryptedName) {
      this.credentialsService.getPassword(this.decryptedName).pipe(
        catchError(error => {
          console.error('Error fetching password:', error);
          return of(null); // Return null if an error occurs
        })
      ).subscribe(response => {
        this.currentPassword = response;
        console.log('Current password:', this.currentPassword);
      });
    }

    this.passwordForm = this.fb.group(
      {
        username: [{ value: this.decryptedName, disabled: true }],
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const currentPasswordInput = this.passwordForm.get('currentPassword')?.value;

      if (currentPasswordInput === this.currentPassword) {
        // Proceed with password change logic
        const newPassword = this.passwordForm.get('newPassword')?.value;
        console.log(this.decryptedName);
        this.updateCredentials(this.decryptedName, newPassword);
      } else {
        console.error('Current password is incorrect.');
        this.snackBar.open('Current password is incorrect.', 'Close', {
          duration: 3000, // Duration in milliseconds
          panelClass: ['error-snackbar'] // Optional: Add custom styles
        });
      }
    }
  }

  updateCredentials(name: string | null, newPassword: string) {
    if (name) {
      this.credentialsService.updateUserCredentials(name, newPassword).subscribe({
        next: () => {
          console.log('Password updated successfully for user:', name);
          // Show Snackbar on success
          this.snackBar.open('Password updated successfully.', 'Close', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['success-snackbar'] // Optional: Add custom styles
          });
        },
        error: (error) => {
          console.error('Error updating password:', error);
          // Show Snackbar on error
          this.snackBar.open('Failed to update password. Please try again.', 'Close', {
            duration: 3000, // Duration in milliseconds
            panelClass: ['error-snackbar'] // Optional: Add custom styles
          });
        }
      });
    } else {
      console.error('User name is not available.');
      // Show Snackbar for missing user name
      this.snackBar.open('User name is not available.', 'Close', {
        duration: 3000, // Duration in milliseconds
        panelClass: ['warning-snackbar'] // Optional: Add custom styles
      });
    }
  }
 
}
