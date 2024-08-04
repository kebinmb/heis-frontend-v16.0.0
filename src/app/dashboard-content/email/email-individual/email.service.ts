import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}
  private apiServerUrl = environment.apiBaseUrl;

  sendEmail(formData: FormData): Observable<string> {
    return this.http
      .post<string>(`${this.apiServerUrl}/emails/send`, formData, {
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  nextDocumentNumber(): Observable<number> {
    return this.http
      .get(`${this.apiServerUrl}/emails/docnum`, { responseType: 'text' })
      .pipe(
        map((response: string) => parseInt(response, 10)),
        catchError(this.handleError)
      );
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http
      .post(`${this.apiServerUrl}`, formData, {
        responseType: 'text' as 'json',
      })
      .pipe(catchError(this.handleError));
  }

  getAllUser(): Observable<any[]> {
    return this.http
      .get(`${this.apiServerUrl}/user/users`, { responseType: 'text' })
      .pipe(
        map((response: any) => {
          try {
            return JSON.parse(response);
          } catch (e) {
            console.error('Failed to parse response', e);
            return [];
          }
        }),
        catchError(this.handleError)
      );
  }

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
}
