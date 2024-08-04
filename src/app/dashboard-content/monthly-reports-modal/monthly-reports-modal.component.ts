import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-monthly-reports-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './monthly-reports-modal.component.html',
  styleUrl: './monthly-reports-modal.component.css'
})
export class MonthlyReportsModalComponent {
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { from:string[],name:string[],documentNumber:string[],attention:string[],receiverName:string[] }) {
    // this.title = this.data.title;
  }
 
}
