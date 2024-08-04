import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getDepartmentDetails(): Observable<any[]> {
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

addNewDepartment(formData: FormData): Observable<string> {
  return this.http.post<any>(`${this.apiServerUrl}/department/newdep`, formData, {
    responseType: 'text' as 'json'
  }).pipe(
    catchError(this.handleError)
  );
}

editDepartmentDetails(id: number, department: any): Observable<any> {
  return this.http.put<any>(`${this.apiServerUrl}/department/edit/${id}`, department, {
    responseType: 'json'
  }).pipe(
    catchError(this.handleError)
  );
}

deleteDepartment(id: number) {
  return this.http.delete(`${this.apiServerUrl}/department/del/${id}`);
}

private handleError(error: HttpErrorResponse): Observable<never> {
  // Handle the error here (log it, transform it, etc.)
  console.error('An error occurred:', error.message);
  return throwError(() => new Error('Something went wrong; please try again later.'));
}

}
