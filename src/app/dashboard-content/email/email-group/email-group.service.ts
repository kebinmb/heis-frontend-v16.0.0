import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailGroupService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }


  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private parseResponse(response: any): any[] {
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse response', e);
      return [];
    }
  }

  getFacultyUser(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/faculty`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getFacultyEmail(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/femail`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getStaffUser(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/staff`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getStaffEmail(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/semail`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getRegularFacultyEmail(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/regfaculty`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getPartTimeFacultyEmail(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/ptfaculty`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getRegularStaffEmail(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/regstaff`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getJobOrderStaffEmail(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/jostaff`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getAllUserDetails(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/users`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  getNextDocumentNumber(): Observable<number> {
    return this.http.get(`${this.apiServerUrl}/emails/docnum`, { responseType: 'text' }).pipe(
      map((response: string) => parseInt(response, 10)),
      catchError(this.handleError)
    );
  }

  getDepartmentDetails(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/department/departdetails`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  sendEmail(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiServerUrl}/emails/sendGroup`, formData, { responseType: 'text' as 'json' }).pipe(
      catchError(this.handleError)
    );
  }
}
