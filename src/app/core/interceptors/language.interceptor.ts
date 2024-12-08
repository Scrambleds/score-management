import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from '../services/language.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  constructor(private languageService: LanguageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const langReq = req.clone({
      setHeaders: {
        'Accept-Language': this.languageService.getCurrentLanguage(),
      },
    });
    return next.handle(langReq);
  }
}
