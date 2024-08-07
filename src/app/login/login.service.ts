import { HttpClient, HttpParams } from '@angular/common/http';
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
  constructor(private http:HttpClient) { }

  public loginAuthentication(username:string,password:string):Observable<User>{
    const params = new HttpParams()
    .set('username', username)
    .set('password', password);
    this.isLoggedIn = true;
    return this.http.get<User>(`${this.apiServerUrl}/user/authenticate`, { params });
  }

  public authentication():boolean{
    return true;
  }
}
