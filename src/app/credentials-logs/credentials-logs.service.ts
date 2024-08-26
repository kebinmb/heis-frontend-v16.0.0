import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {
apiBaseUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getCredentialLogs(date:string,campus:number):Observable<any[]>{
    const params = new HttpParams()
    .set('date',date)
    .set('campus',campus.toString())
    return (this.http.get(`${this.apiBaseUrl}/logs/usercredlogs`,{params,responseType:'text'}).pipe(
      map((response:any)=>{
        try{
          // console.log("Credentials Logs From Service:",response)
          return JSON.parse(response);
        }catch(e){
          console.error('Failed to parse response',e);
          return [];
        }
      })
    ))
  }
}
