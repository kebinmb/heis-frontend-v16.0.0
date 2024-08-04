import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-reports-modal',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './reports-modal.component.html',
  styleUrl: './reports-modal.component.css'
})
export class ReportsModalComponent {
  title: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { memos: string[],timestamp:string[],title: string }) {
    this.title = this.data.title;
  }
 
}
