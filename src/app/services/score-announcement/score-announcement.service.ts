import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      tap((_) => console.log('EmailPlaceholder done!!'))
    );
  }

  loadEmailTemplate(): Observable<any[]> {
    const url = `${environment.apiUrl}/api/MasterData/EmailPlaceholder`;
    return this.http.get<Record<string, string>>(url, this.httpOptions).pipe(
      map((response: any) => response.objectResponse),
      tap((_) => console.log('EmailPlaceholder done!!'))
    );
  }
}
