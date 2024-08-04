import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }
 

  getArchives():Observable<any[]>{
    return this.http.get(`${this.apiServerUrl}/archives/documents`,{responseType:'text'}).pipe(
      map((response:any)=>{
        try{
          return JSON.parse(response);
        }catch(e){
          console.error('Failed to parse response',e)
          return[];
        }
      })
    )
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

  
}
