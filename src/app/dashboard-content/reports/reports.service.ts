import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getDailyReports(date:string,name:string):Observable<any[]>{
    return this.http.get(`${this.apiServerUrl}/reports/daily/${date}`, {params:{name:name.toString()}, responseType: 'text' }).pipe(
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

  getMonthlyReports(month:string,year:string,name:string): Observable<any[]>{
    
    return this.http.get(`${this.apiServerUrl}/reports/monthly/${month}/${year}`,{params:{name:name.toString()},responseType:'text'}).pipe(
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

  getUserList():Observable<any[]>{
    return this.http.get(`${this.apiServerUrl}/reports/receivers`,{responseType:'text'}).pipe(
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

  getExternalReports(externalDate:string,externalYear:string,name:string):Observable<any[]>{
    return this.http.get(`${this.apiServerUrl}/reports/external/${externalDate}/${externalYear}`, {params:{name:name.toString()}, responseType: 'text' }).pipe(
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

  getDepartmentDetails(): Observable<any[]>{
    return this.http.get(`${this.apiServerUrl}/department/departdetails`, { responseType: 'text' }).pipe(
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
