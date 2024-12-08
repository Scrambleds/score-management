import { Injectable } from '@angular/core';
import { TranslationService } from './translation.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private currentLang = '';
  private defaultLanguage = 'th';

  constructor(private translationService: TranslationService) {}

  setLanguage(lang: string): void {
    this.currentLang = lang;
    this.translationService.loadTranslations(lang); // โหลดคำแปลใหม่
    if (this.isBrowser()) {
      localStorage.setItem('language', lang); // เก็บค่าใน Local Storage
    }
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  getCurrentLanguage(): string {
    if (this.isBrowser()) {
      const savedLang = localStorage.getItem('language');
      this.currentLang = savedLang || this.defaultLanguage;
    }

    return this.currentLang;
  }
}
