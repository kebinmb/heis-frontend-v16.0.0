import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
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

  getDocumentLogs(date: string, campus: string): Observable<any[]> {
    const params = new HttpParams()
        .set('date', date)
        .set('campus', campus.toString());

    const url = campus === "4"
        ? `${this.apiServerUrl}/logs/documentLogsTalisayAccess`
        : `${this.apiServerUrl}/logs/documentLogs`;
    // ////console.log(url);
    return this.http.get(url, { params, responseType: 'text' }).pipe(
        map((response: string) => {
            try {
                return JSON.parse(response);
            } catch (e) {
                console.error('Failed to parse response', e);
                return [];
            }
        }),
        catchError((error) => {
            console.error('Error fetching document logs', error);
            return of([]); // Return an empty array in case of an error
        })
    );
}


  getUserMaintenanceLogs(date:string,campus:number):Observable<any[]>{
    const params = new HttpParams()
    .set('date',date)
    .set('campus',campus.toString())
    return (this.http.get(`${this.apiServerUrl}/logs/usermainteLogs`,{params,responseType:'text'}).pipe(
      map((response:any)=>{
        try{
          return JSON.parse(response);
        }catch(e){
          console.error('Failed to parse response',e);
          return [];
        }
      })
    ))
  }

  getActivityLogs(date:string,campus:number):Observable<any[]>{
    const params = new HttpParams()
    .set('date',date)
    .set('campus',campus.toString())
    return (this.http.get(`${this.apiServerUrl}/logs/activitylogs`,{params,responseType:'text'}).pipe(
      map((response:any)=>{
        try{
          return JSON.parse(response);
        }catch(e){
          console.error('Failed to parse resposne',e);
          return [];
        }
      })
    ))
  }
}
