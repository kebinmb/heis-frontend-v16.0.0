import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, of, throwError } from 'rxjs';

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

editDepartmentDetails(id: number, department: any,name:string): Observable<any> {
  const params = new HttpParams().set('name', name);
  return this.http.put<any>(`${this.apiServerUrl}/department/edit/${id}`, department, {
    params: params,
    responseType: 'json'
  }).pipe(
    catchError(this.handleError)
  );
}

deleteDepartment(id: number) {
  return this.http.delete(`${this.apiServerUrl}/department/del/${id}`);
}

deleteUser(id: number) {
  return this.http.delete(`${this.apiServerUrl}/department/del/user/${id}`);
}

addNewUser(formData: any): Observable<any> {
  return this.http.post<any>(`${this.apiServerUrl}/department/new/user`, formData).pipe(
    catchError(this.handleErrorDetailed('addNewUser', formData))
  );
}

getTotalUser(){
  return this.http.get(`${this.apiServerUrl}/department/user/total`,{responseType:'text'}).pipe(
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

editUserDetails(id: number, user: any,name:string): Observable<any> {
  const params = new HttpParams().set('name', name);
  return this.http.put<any>(`${this.apiServerUrl}/department/edit/user/${id}`, user, {
    params:params,
    responseType: 'json'
  }).pipe(
    catchError(this.handleError)
  );
}


private handleErrorDetailed<T>(operation = 'operation', formData?: FormData) {
  return (error: any): Observable<T> => {
    // Log the error to the console or remote logging infrastructure
    console.error(`${operation} failed: ${error.message}`);
    console.error(`Form Data: ${JSON.stringify(formData)}`);
    console.error('Error Details:', error);

    // TODO: Send the error to remote logging infrastructure
    // log to a backend server, etc.

    // Return a user-friendly error message
    return throwError({
      status: error.status,
      message: `An error occurred while trying to ${operation}: ${error.message}`,
      error: error.error
    });
  };
}



private handleError(error: HttpErrorResponse): Observable<never> {
  // Handle the error here (log it, transform it, etc.)
  console.error('An error occurred:', error.message);
  return throwError(() => new Error('Something went wrong; please try again later.'));
}

}
