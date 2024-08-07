import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private http:HttpClient) { }
  private apiServerUrl = environment.apiBaseUrl;
  getUserList():Observable<any[]>{
    return this.http.get(`${this.apiServerUrl}/user/users`,{responseType:'text'}).pipe(
      map((response:any)=>{
        try{
          return JSON.parse(response);
        }catch(e){
          console.error('Failed to parse response');
          return [];
        }
      })
    );
  }

  getLogs(date: string, campus: number): Observable<any[]> {
    const params = new HttpParams()
      .set('date', date)
      .set('campus', campus.toString())
     

    return this.http.get(`${this.apiServerUrl}/logs/searchlogs`, { params, responseType: 'text' }).pipe(
      map((response: any) => {
        try {
          return JSON.parse(response);
        } catch (e) {
          console.error('Failed to parse response', e);
          return [];
        }
      })
    );
  }
}
