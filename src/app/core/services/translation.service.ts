import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private translations = new BehaviorSubject<Record<string, string>>({});
  private defaultLanguage = 'th'; // กำหนดภาษาเริ่มต้นเป็นภาษาไทย

  constructor(private http: HttpClient) {
    this.setInitialLanguage();
  }
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
  // ตั้งค่าภาษาเริ่มต้น
  private setInitialLanguage(): void {
    let lang = this.defaultLanguage;

    if (this.isBrowser()) {
      const savedLang = localStorage.getItem('language');
      lang = savedLang || this.defaultLanguage;
    }

    // this.loadTranslations(lang);
  }

  loadTranslations(language: string): void {
    this.http
      .get<Record<string, string>>(
        `${environment.apiUrl}/api/MasterData/Language?language=${language}`
      )
      .subscribe((data: any) => {
        const translations = data.objectResponse;
        this.translations.next(translations);
      });
    // const mockData = this.getMockTranslations(language);
    // console.log(mockData);
    // this.translations.next(mockData);
    if (this.isBrowser()) {
      localStorage.setItem('language', language);
    }
  }

  //   getTranslation(key: string): string {
  //     return this.translations.getValue()[key] || key;
  //   }

  getTranslations(): Observable<Record<string, string>> {
    return this.translations.asObservable();
  }
  getTranslation(key: string, params?: Record<string, string>): string {
    // console.log('=================');
    let template = this.translations.getValue()[key] || key;
    // console.log(template);
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        template = template.replace(`{${paramKey}}`, paramValue);
      }
    }
    return template;
  }

  // Mock Data สำหรับแต่ละภาษา
  private getMockTranslations(lang: string): Record<string, any> {
    const mockTranslations: { [key: string]: Record<string, any> } = {
      en: {
        welcome_message: 'Welcome {username}',
        logout: 'Logout',
        home: 'Home',
        insert_product: 'Insert a Product',
        language: 'Language',
        list: 'list',
        login: 'Login',
        login_user_not_found: '{username} not found',
        login_success: 'Welcome {username}',
        login_failed: 'username / password incorrect',
        chat: 'Chat',
        mail_template1:
          'There was an error sending. email to {student_name}\ndetail : {error_detail}',
      },
      th: {
        welcome_message: 'ยินดีต้อนรับ {username}',
        logout: 'ออกจากระบบ',
        home: 'หน้าแรก',
        insert_product: 'เพิ่มสินค้า',
        language: 'ภาษา',
        list: 'รายการ',
        login: 'เข้าสู่ระบบ',
        login_user_not_found: '{username} ไม่พบผู้ใช้งาน',
        login_success: 'ยินดีต้อนรับ {username}',
        login_failed: 'บัญชีผู้ใช้ / รหัสผ่านไม่ถูกต้อง',
        chat: 'สนทนา',
        mail_template1:
          'เกิดข้อผิดพลาดในการส่ง อีเมลไปยัง {student_name}\nรายละเอียด : {error_detail}',
      },
    };

    return mockTranslations[lang] || {};
  }
}
