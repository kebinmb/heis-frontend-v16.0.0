import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, firstValueFrom, map, Observable, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { EmailMultipleService } from './email-multiple.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-email-multiple',
  standalone: true,
  templateUrl: './email-multiple.component.html',
  styleUrls: ['./email-multiple.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatCheckboxModule,
  ],
})
export class EmailMultipleComponent implements OnInit {
  emailForm: FormGroup;
  nextDocumentNumber: number;
  filteredEmails: Observable<string[]>[] = [];
  filteredThroughUsers: Observable<string[]>;
  filteredAttentionUsers: Observable<string[]>;
  filteredFromUsers: Observable<string[]>;
  attentionAddress: string;
  emailAddressThrough: string;
  fromAddressEmail: string;
  loading = false;
  usersName: string[] = [];
  departmentId: any[] = [1];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private emailMultipleService: EmailMultipleService,
    private cdr: ChangeDetectorRef
  ) {
    this.emailForm = this.formBuilder.group({
      documentNumber: [{ value: this.nextDocumentNumber, disabled: true }],
      dateOfLetter: ['', Validators.required],
      subject: ['', Validators.required],
      through: ['', Validators.required],
      type: ['', Validators.required],
      attention: this.formBuilder.array([]),
      from: ['', Validators.required],
      pageCount: [1, Validators.required],
      attachment: ['', Validators.required],
      campus: [4, Validators.required],
      cc: this.formBuilder.array([]),
      encoder: [4, Validators.required],
      message: ['', Validators.required],
      departmentId: ['523'],
    });
  }

  ngOnInit() {
    this.getNextDocumentNumber();
    this.getUsersName();
    this.setupAutocompleteFilters();
  }

  private setupAutocompleteFilters(): void {
    this.filteredThroughUsers = this.getControl('through').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value ?? ''))
    );

    this.filteredAttentionUsers = this.getControl('attention').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value ?? ''))
    );

    this.filteredFromUsers = this.getControl('from').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => this._filter(value ?? ''))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usersName.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  private async getEmailByName(name: string): Promise<string> {
    try {
      const users: any = await firstValueFrom(this.emailMultipleService.getAllUserDetails());
      const matchedUser = users.find((user: any) => user.name === name);
      return matchedUser ? matchedUser.email : '';
    } catch (error) {
      console.error('Error fetching user details:', error);
      return '';
    }
  }

  private async getEmailThrough(): Promise<void> {
    try {
      const userInputName = this.emailForm.value.through;
      const users: any = await firstValueFrom(this.emailMultipleService.getAllUserDetails());
      const matchedUser = users.find((user: any) => user.name === userInputName);
      this.emailAddressThrough = matchedUser ? matchedUser.email : '';
    } catch (error) {
      console.error('Error fetching through email:', error);
    }
  }

  private async getEmailFrom(): Promise<void> {
    try {
      const userInputName = this.emailForm.value.from;
      const users: any = await firstValueFrom(this.emailMultipleService.getAllUserDetails());
      const matchedUser = users.find((user: any) => user.name === userInputName);
      this.fromAddressEmail = matchedUser ? matchedUser.email : '';
    } catch (error) {
      console.error('Error fetching from email:', error);
    }
  }

  private async getAttentionEmails(): Promise<string> {
    try {
      const attentionEmails = await Promise.all(
        this.attentionArray.controls.map(async control => {
          const name = control.value;
          const email = await this.getEmailByName(name);
          return email;
        })
      );
      return attentionEmails.filter(email => email).join(', ');
    } catch (error) {
      console.error('Error fetching attention emails:', error);
      return '';
    }
  }

  private getUsersName() {
    this.emailMultipleService.getAllUserDetails().subscribe({
      next: (users) => {
        this.usersName = users.map(user => user.name);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching users names:', error);
      }
    });
  }

  async sendEmail() {
    if (this.emailForm.valid) {
      const {
        subject,
        dateOfLetter,
        type,
        campus,
        through,
        from,
        pageCount,
        cc,
        encoder,
        message,
        departmentId,
      } = this.emailForm.value;
      const formData = new FormData();
      const files: FileList = this.emailForm.get('attachment')?.value;

    if (isNaN(pageCount) || isNaN(departmentId)) {
      console.error('pageCount or departmentId is invalid.');
      return;
    }

    Array.from(files).forEach(file => {
      formData.append('attachment', file);
    });

      
      formData.append('documentNumber', this.nextDocumentNumber.toString());
      formData.append('subject', subject);
      formData.append('dateOfLetter', this.formatDate(dateOfLetter));
      formData.append('type', type);
      formData.append('campus', campus);
      formData.append('encoder', encoder);

      const attentionEmails = await this.getAttentionEmails();
      formData.append('attention', attentionEmails);

      await this.getEmailThrough();
      formData.append('through', this.emailAddressThrough);
      await this.getEmailFrom();
      formData.append('from', this.fromAddressEmail);

      formData.append('cc', cc);
      formData.append('pageCount', pageCount.toString());
      formData.append('message', message);
      formData.append('departmentId', this.departmentId[0]);
      this.loading = true;

      this.emailMultipleService.sendEmail(formData).subscribe({
        next: () => {
          this.loading = false;
          alert('Document was sent successfully');
          this.emailForm.reset();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([this.router.url]);
          });
        },
        error: (error) => {
          console.error('Error sending document:', error);
          alert('Error sending document');
          this.loading = false;
        },
      });
    } else {
      alert('Form is invalid');
    }
  }

  get attentionArray(): FormArray {
    return this.emailForm.get('attention') as FormArray;
  }

  get ccArray(): FormArray {
    return this.emailForm.get('cc') as FormArray;
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  addAttention(): void {
    const control = this.formBuilder.control('');
    this.attentionArray.push(control);
    this.filteredEmails.push(
      control.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map(value => this._filter(value ?? ''))
      )
    );
  }

  removeAttention(index: number): void {
    this.attentionArray.removeAt(index);
    this.filteredEmails.splice(index, 1);
  }

  addCc(): void {
    this.ccArray.push(this.formBuilder.control('', Validators.email));
  }

  removeCc(index: number): void {
    this.ccArray.removeAt(index);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.emailForm.patchValue({ attachment: input.files });
    }
  }

   getControl(controlName: string): FormControl {
    return this.emailForm.get(controlName) as FormControl;
  }

  private getNextDocumentNumber() {
    this.emailMultipleService.getNextDocumentNumber().subscribe({
      next: (nextDocumentNumber) => {
        this.nextDocumentNumber = nextDocumentNumber;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error fetching next document number:', error);
      }
    });
  }
}
