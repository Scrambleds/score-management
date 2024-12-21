import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  responseCache = new Map();
  constructor() {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // ตรวจสอบว่า token มีอยู่ใน localStorage หรือไม่
    const token = localStorage.getItem('token');

    // หากมี token, จะใส่ใน Authorization header
    let requestinjected = request;

    if (token) {
      requestinjected = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (request.method !== 'GET') {
      return next.handle(requestinjected); // แค่ Cache GET Requests
    }
    if (!this.canCache(request)) {
      return next.handle(requestinjected);
    }
    const cache = this.responseCache.get(request.urlWithParams);
    if (cache) {
      return of(cache);
    }
    return next.handle(requestinjected).pipe(
      tap((res) => {
        this.responseCache.set(request.urlWithParams, res);
      })
    );
  }

  canCache(request: HttpRequest<unknown>): boolean {
    return request.urlWithParams.includes('/api/MasterData');
  }

  // ฟังก์ชันลบแคชสำหรับ URL ที่กำหนด
  clearCacheForUrl(url: string): void {
    this.responseCache.delete(url);
  }

  // ฟังก์ชันลบแคชทั้งหมด
  clearAllCache(): void {
    this.responseCache.clear();
  }
}
