import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


interface User {
  id: number;
  username: string;
  password: string;
  accessLevel: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiServerUrl = environment.apiBaseUrl;
  isLoggedIn:boolean = false;
  constructor(private http: HttpClient) { }

  public loginAuthentication(username: string, password: string): Observable<User> {
    // Create the request payload
    const body = { username, password };

    // Set headers, if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Send POST request
    return this.http.post<User>(`${this.apiServerUrl}/user/authenticate`, body, { headers });
  }

  public setLoginStatus(status: boolean): void {
    this.isLoggedIn = status;
  }

  public getLoginStatus(): boolean {
    return this.isLoggedIn;
  }
}
