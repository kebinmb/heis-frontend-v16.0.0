import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  message: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string },
  private dialogRef: MatDialogRef<AlertComponent>) {
    this.message = data.message;
  }

  onClose(): void {
    this.dialogRef.close(); // Close the dialog
  }
}
