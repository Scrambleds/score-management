import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class SelectBoxService {
  private Url = `${environment.apiUrl}/api/MasterData/SystemParam`;

  constructor(private http: HttpClient) {}

  getSystemParamRole(role: string): Observable<any> {
    const params = new HttpParams().append('reference', role);

    return this.http.get<any>(this.Url, { params });
  }
  getSystemParamPrefix(prefix: string): Observable<any> {
    const params = new HttpParams().append('reference', prefix);

    return this.http.get<any>(this.Url, { params });
  }
  getSystemParamStatus(Status: string): Observable<any> {
    const params = new HttpParams().append('reference', Status);

    return this.http.get<any>(this.Url, { params });
  }
}