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
    this.setInitialLanguage(); // เรียกใช้เพื่อโหลดภาษาที่เก็บไว้
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private setInitialLanguage(): void {
    let lang = this.defaultLanguage;

    // ถ้าเป็นการเรียกใน browser และมีการเก็บภาษาใน localStorage
    if (this.isBrowser()) {
      const savedLang = localStorage.getItem('language');
      lang = savedLang || this.defaultLanguage; // ใช้ภาษาที่เก็บไว้ ถ้าไม่มีใช้ภาษาเริ่มต้น
    }

    this.loadTranslations(lang);
  }

  loadTranslations(language: string): void {
    // เช็คว่าโค้ดนี้ทำงานใน browser หรือไม่
    if (typeof window !== 'undefined') {
      const savedTranslations = localStorage.getItem(
        `translations_${language}`
      );

      if (savedTranslations) {
        // ถ้ามีคำแปลใน localStorage ใช้คำแปลเหล่านั้นเลย
        this.translations.next(JSON.parse(savedTranslations));
      } else {
        // ถ้าไม่มีคำแปลใน localStorage ให้ดึงจาก API
        this.http
          .get<Record<string, string>>(
            `${environment.apiUrl}/api/MasterData/Language?language=${language}`
          )
          .subscribe((data: any) => {
            const translations = data.objectResponse;
            this.translations.next(translations);

            // เก็บคำแปลที่ได้รับจาก API ไว้ใน localStorage
            if (this.isBrowser()) {
              localStorage.setItem(
                `translations_${language}`,
                JSON.stringify(translations)
              );
              localStorage.setItem('language', language); // เก็บภาษาปัจจุบัน
            }
          });
      }
    }
  }

  getTranslations(): Observable<Record<string, string>> {
    return this.translations.asObservable();
  }

  getTranslation(key: string, params?: Record<string, string>): string {
    let template = this.translations.getValue()[key] || key;
    if (params) {
      for (const [paramKey, paramValue] of Object.entries(params)) {
        template = template.replace(`{${paramKey}}`, paramValue);
      }
    }
    return template;
  }

  changeLanguage(lang: string): void {
    // เมื่อมีการเปลี่ยนภาษา จะโหลดคำแปลใหม่และเก็บไว้ใน localStorage
    this.loadTranslations(lang);
  }
}
// export class TranslationService {
//   private translations = new BehaviorSubject<Record<string, string>>({});
//   private defaultLanguage = 'th'; // กำหนดภาษาเริ่มต้นเป็นภาษาไทย

//   constructor(private http: HttpClient) {
//     // this.setInitialLanguage();
//     // if (this.isBrowser()) {
//     //   const savedLang = localStorage.getItem('language');
//     //   if (savedLang === undefined || savedLang === '') {
//     //     this.setInitialLanguage();
//     //   }
//     // }
//   }
//   private isBrowser(): boolean {
//     return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
//   }
//   // ตั้งค่าภาษาเริ่มต้น
//   private setInitialLanguage(): void {
//     let lang = this.defaultLanguage;

//     if (this.isBrowser()) {
//       console.log('true');
//       const savedLang = localStorage.getItem('language');
//       console.log('savelang :', savedLang);
//       lang = savedLang || this.defaultLanguage;
//     }

//     this.loadTranslations(lang);
//   }

//   loadTranslations(language: string): void {
//     console.log('loadTranslation', language);
//     this.http
//       .get<Record<string, string>>(
//         `${environment.apiUrl}/api/MasterData/Language?language=${language}`
//       )
//       .subscribe((data: any) => {
//         const translations = data.objectResponse;
//         console.log(translations);
//         this.translations.next(translations);
//       });
//     // const mockData = this.getMockTranslations(language);
//     // console.log(mockData);
//     // this.translations.next(mockData);
//     if (this.isBrowser()) {
//       localStorage.setItem('language', language);
//     }
//   }

//   //   getTranslation(key: string): string {
//   //     return this.translations.getValue()[key] || key;
//   //   }

//   getTranslations(): Observable<Record<string, string>> {
//     return this.translations.asObservable();
//   }
//   getTranslation(key: string, params?: Record<string, string>): string {
//     // console.log('=================');
//     let template = this.translations.getValue()[key] || key;
//     // console.log(template);
//     if (params) {
//       for (const [paramKey, paramValue] of Object.entries(params)) {
//         template = template.replace(`{${paramKey}}`, paramValue);
//       }
//     }
//     return template;
//   }

//   // Mock Data สำหรับแต่ละภาษา
//   private getMockTranslations(lang: string): Record<string, any> {
//     const mockTranslations: { [key: string]: Record<string, any> } = {
//       en: {
//         welcome_message: 'Welcome {username}',
//         logout: 'Logout',
//         home: 'Home',
//         insert_product: 'Insert a Product',
//         language: 'Language',
//         list: 'list',
//         login: 'Login',
//         login_user_not_found: '{username} not found',
//         login_success: 'Welcome {username}',
//         login_failed: 'username / password incorrect',
//         chat: 'Chat',
//         mail_template1:
//           'There was an error sending. email to {student_name}\ndetail : {error_detail}',
//       },
//       th: {
//         welcome_message: 'ยินดีต้อนรับ {username}',
//         logout: 'ออกจากระบบ',
//         home: 'หน้าแรก',
//         insert_product: 'เพิ่มสินค้า',
//         language: 'ภาษา',
//         list: 'รายการ',
//         login: 'เข้าสู่ระบบ',
//         login_user_not_found: '{username} ไม่พบผู้ใช้งาน',
//         login_success: 'ยินดีต้อนรับ {username}',
//         login_failed: 'บัญชีผู้ใช้ / รหัสผ่านไม่ถูกต้อง',
//         chat: 'สนทนา',
//         mail_template1:
//           'เกิดข้อผิดพลาดในการส่ง อีเมลไปยัง {student_name}\nรายละเอียด : {error_detail}',
//       },
//     };

//     return mockTranslations[lang] || {};
//   }
// }
