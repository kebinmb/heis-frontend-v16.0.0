import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-external-report-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './external-report-modal.component.html',
  styleUrl: './external-report-modal.component.css'
})
export class ExternalReportModalComponent {
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { name:string[],documentNumber:number[],attention:string[],receiverName:string[] }) {
    // this.title = this.data.title;
  }
}
