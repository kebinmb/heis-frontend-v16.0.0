import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
  apiBaseUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  updateUserCredentials(name: string, password: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const body = `name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`;

    return this.http.post<string>(`${this.apiBaseUrl}/user/updatecreds`, body, { headers,responseType: 'text' as 'json' });
  }
 
  getPassword(name: string): Observable<string> {
    return this.http
      .get(`${this.apiBaseUrl}/user/pw`, {
        params: { name },
        responseType: 'text'
      })
      .pipe(
        catchError(this.handleError<string>('getUserPassword', ''))
      );
  }

 

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  

  
}
