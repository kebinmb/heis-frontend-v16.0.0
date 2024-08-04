import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailMultipleService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getNextDocumentNumber(): Observable<number> {
    return this.http.get(`${this.apiServerUrl}/emails/docnum`, { responseType: 'text' }).pipe(
      map((response: string) => parseInt(response, 10)),
      catchError(this.handleError)
    );
  }
  getAllUserDetails(): Observable<any[]> {
    return this.http.get(`${this.apiServerUrl}/user/users`, { responseType: 'text' }).pipe(
      map(this.parseResponse),
      catchError(this.handleError)
    );
  }

  sendEmail(formData: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiServerUrl}/emails/sendGroup`, formData, { responseType: 'text' as 'json' }).pipe(
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

  private parseResponse(response: any): any[] {
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Failed to parse response', e);
      return [];
    }
  }
}
