import { Component, OnInit } from '@angular/core';
import { EmailService } from './email.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { firstValueFrom, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { FormArrayException } from '../../exceptions/formArrayException';


@Component({
  selector: 'app-email-individual',
  templateUrl: './email-individual.component.html',
  styleUrls: ['./email-individual.component.css'],
})
export class EmailIndividualComponent implements OnInit {
  getControl(controlName: string): FormControl {
    return this.emailForm.get(controlName) as FormControl;
  }
  emailForm: FormGroup;
  nextDocumentNumber: number;
  emailAddress: string;
  attentionAddress: string;
  fromAddress: string;
  documentDepartmentId: number;
  usersName: string[] = [];
  filteredThroughUsers: Observable<string[]>;
  filteredAttentionUsers: Observable<string[]>;
  filteredFromUsers: Observable<string[]>;
  loading: boolean = false;

  constructor(
    private emailService: EmailService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.emailForm = this.formBuilder.group({
      documentNumber: [{ value: this.nextDocumentNumber, disabled: true }],
      subject: ['', Validators.required],
      dateOfLetter: ['', Validators.required],
      type: ['', Validators.required],
      attention: ['', Validators.required],
      through: ['', Validators.required],
      from: ['', Validators.required],
      pageCount: [1, Validators.required],
      attachment: ['', Validators.required],
      campus: [4, Validators.required],
      cc: this.formBuilder.array([]),
      encoder: [4, Validators.required],
      message: ['', Validators.required],
      departmentId: [''],
    });
  }

  ngOnInit() {
    this.getDocumentCount();
    this.getAllUser();

    this.filteredThroughUsers = this.emailForm
      .get('through')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );

    this.filteredFromUsers = this.emailForm.get('from')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );

    this.filteredAttentionUsers = this.emailForm
      .get('attention')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.usersName.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  //Added Exception FormArrayException
  get ccArray(): FormArray {
    try {
      return this.emailForm.get('cc') as FormArray;
    } catch (e) {
      if (e instanceof Error) {
        throw new FormArrayException(
          'Failed to get cc FormArray: ' + e.message
        );
      } else {
        throw new FormArrayException(
          'Failed to get cc FormArray: An unknown error occurred.'
        );
      }
    }
  }

  //Added Exception FormArrayException
  addCc(): void {
    try {
      this.ccArray.push(this.formBuilder.control('', Validators.email));
    } catch (e) {
      if (e instanceof Error) {
        throw new FormArrayException(
          'Failed to push elements in the array: ' + e.message
        );
      } else {
        throw new FormArrayException(
          'Failed to push elements in the array: An unknown error occured.'
        );
      }
    }
  }

  removeCc(index: number): void {
    this.ccArray.removeAt(index);
  }

  getDocumentCount(): void {
    this.emailService.nextDocumentNumber().subscribe({
      next: (count) => {
        this.nextDocumentNumber = count;
        console.log('Total documents:', this.nextDocumentNumber);
      },
      error: (error) => {
        console.error('Error fetching the total document count', error);
      },
    });
  }

  //Added try-catch blocks and modularize the code
  async sendEmail() {
    if (!this.emailForm.valid) {
      alert('Form is invalid');
      return;
    }

    const formData = new FormData();
    const {
      documentNumber,
      subject,
      dateOfLetter,
      type,
      attention,
      through,
      from,
      pageCount,
      campus,
      cc,
      encoder,
      message,
      departmentId,
    } = this.emailForm.value;

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
    formData.append('pageCount', pageCount.toString());
    formData.append('campus', campus.toString());
    formData.append('cc', cc);
    formData.append('encoder', encoder.toString());
    formData.append('message', message);
    

    try {
      await this.appendEmailFields(formData);
      this.loading = true;

      this.emailService.sendEmail(formData).subscribe({
        next: (response) => {
          this.loading = false;
          alert('Document was sent successfully');
          this.emailForm.reset();
          this.router.navigateByUrl('/archives', { skipLocationChange: true }).then(() => {
            this.router.navigate([this.router.url]);
            window.location.reload();
          });
        },
        error: (error) => {
          console.error('Error sending email:', error);
          alert('An error occurred while sending the document');
          this.loading = false;
        },
      });
    } catch (error) {
      console.error('Error during email preparation:', error);
      alert('An error occurred during email preparation');
    }
  }

  private async appendEmailFields(formData: FormData) {
    try {
      await this.getEmailAttention();
      formData.append('attention', this.attentionAddress);

      await this.getEmailThrough();
      formData.append('through', this.emailAddress);

      await this.getEmailFrom();
      formData.append('from', this.fromAddress);

      await this.getDepartmentId();
      formData.append('departmentId', this.documentDepartmentId.toString());
    } catch (error) {
      throw new Error(
        'Failed to append email fields: ' +
          (error instanceof Error ? error.message : 'Unknown error')
      );
    }
  }

  //Updated the code
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.emailForm.patchValue({ attachment: input.files });
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  //Optimized Code
  getAllUser() {
    this.emailService.getAllUser().subscribe({
      next: (users) => this.handleUsersResponse(users),
      error: (error) => this.handleUsersError(error),
    });
  }

  private handleUsersResponse(users: any[]) {
    try {
      this.usersName = users.map((user) => user.name);
      console.log(this.usersName);
    } catch (error) {
      this.handleUsersError(error);
    }
  }

  private handleUsersError(error: any) {
    console.error('Error fetching users:', error);
    alert(
      'An error occurred while fetching users: ' +
        (error instanceof Error ? error.message : 'Unknown error')
    );
  }

  //Optimized Code
  async getEmailThrough(): Promise<void> {
    try {
      const userInputName = this.emailForm.value.through;
      const users: any = await firstValueFrom(this.emailService.getAllUser());
      const matchedUser = users.find(
        (user: any) => user.name === userInputName
      );
      if (matchedUser) {
        this.emailAddress = matchedUser.email;
        console.log(this.emailAddress);
      } else {
        console.error('No user found with the provided name');
      }
    } catch (error) {
      console.error('Error fetching users from through column: ', error);
    }
  }
  //Optimized Code
  async getEmailAttention(): Promise<void> {
    try {
      const userInputName = this.emailForm.value.attention;
      const users: any = await firstValueFrom(this.emailService.getAllUser());
      const matchedUser = users.find(
        (user: any) => user.name === userInputName
      );
      if (matchedUser) {
        this.attentionAddress = matchedUser.email;
        console.log(this.attentionAddress);
      } else {
        console.error('No user found with the provided name');
      }
    } catch (error) {
      console.error('Error fetching users from attention column: ', error);
    }
  }
  //Optimized Code
  async getEmailFrom(): Promise<void> {
    try {
      const userInputName = this.emailForm.value.from;
      const users: any = await firstValueFrom(this.emailService.getAllUser());
      const matchedUser = users.find(
        (user: any) => user.name === userInputName
      );
      if (matchedUser) {
        this.fromAddress = matchedUser.email;
        console.log(this.fromAddress);
      } else {
        console.error('No user found with the provided name');
      }
    } catch (error) {
      console.error('Error fetching users from from column: ', error);
    }
  }

  //Department Id Should be existing in the Table
  async getDepartmentId(): Promise<void> {
    try {
      const userInputName = this.emailForm.value.from;
      const users: any = await firstValueFrom(this.emailService.getAllUser());
      const matchedUser = users.find(
        (user: any) => user.name === userInputName
      );
      if (matchedUser) {
        this.documentDepartmentId = matchedUser.departmentId;
      } else {
        console.error('No user found');
      }
    } catch (error) {
      console.error('Error fetching department Id');
    }
  }
}
