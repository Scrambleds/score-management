import { Injectable } from '@angular/core';
import { TranslationService } from './translation.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang = 'th';

  constructor(private translationService: TranslationService) {}

  // setLanguage(lang: string): void {
  //   this.currentLang = lang;
  //   // this.translationService.loadTranslations(lang);
  // }
  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.translationService.loadTranslations(lang); // โหลดคำแปลใหม่
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang); // เก็บค่าใน Local Storage
    }
  }

  getCurrentLanguage(): string {
    return this.currentLang;
  }
}
