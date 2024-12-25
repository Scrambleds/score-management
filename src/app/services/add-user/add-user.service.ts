import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AddUserService {
  private apiUrlInsert = `${environment.apiUrl}/api/EditUser/InsertUser`;

  // ใช้ BehaviorSubject เก็บข้อผิดพลาด
  private errorsSubject = new BehaviorSubject<string[]>([]);
  public errors$ = this.errorsSubject.asObservable();  // observable ให้คอมโพเนนต์ subscribe

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (!token || !tokenExpiration) {
      console.error('Token or token expiration is missing');
      return null;
    }

    const expirationDate = new Date(tokenExpiration);
    if (new Date().getTime() > expirationDate.getTime()) {
      console.error('Token is expired');
      return null;
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  insertUser(data: any[]): Observable<any> {
    const headers = this.getAuthHeaders();
    if (!headers) {
      return throwError(() => new Error('Authorization token is missing or invalid'));
    }

    console.log('Making request with headers:', headers);
    return this.http.post<any>(this.apiUrlInsert, data, { headers, withCredentials: true }).pipe(
      catchError((error) => {
        console.error('Error occurred while inserting user data:', error);
        if (error.error && error.error.errors) {
          // เก็บ errors ไว้ใน BehaviorSubject
          this.errorsSubject.next(error.error.errors);
        }
        return throwError(() => new Error('Failed to insert user data. Please try again.'));
      })
    );
  }
}