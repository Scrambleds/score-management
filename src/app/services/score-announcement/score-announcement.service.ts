import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScoreAnnouncementService {
  private httpOptions = {
    headers: new HttpHeaders({
      'content-type': 'application/json;charset=UTF-8',
    }),
    responseType: 'json' as 'json',
  };

  constructor(private http: HttpClient) {}

  loadEmailPlaceholder(): Observable<any[]> {
    const url = `${environment.apiUrl}/api/MasterData/EmailPlaceholder`;
    return this.http.get<Record<string, string>>(url, this.httpOptions).pipe(
      map((response: any) => response.objectResponse),
      tap((_) => console.log('emailPlaceholder done!!'))
    );
  }

  loadEmailTemplate(username: string): Observable<any[]> {
    const url = `${environment.apiUrl}/api/MasterData/EmailTemplate`;
    const params = new HttpParams().set('username', username);
    return this.http
      .get<Record<string, string>>(url, { params, ...this.httpOptions })
      .pipe(
        map((response: any) => response.objectResponse),
        tap((_) => console.log('loadEmailTemplate done!!'))
      );
  }

  updateEmailTemplate(template: any): Observable<any> {
    const url = `${environment.apiUrl}/api/StudentScore/UpdateTemplate`;
    return this.http.post<any>(url, template, { ...this.httpOptions }).pipe(
      map((response: any) => console.log(response)),
      tap((_) => console.log('updateEmailTemplate done!!'))
    );
  }
}
