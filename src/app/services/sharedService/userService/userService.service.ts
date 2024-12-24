import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfo: any;

  constructor() {
    this.loadUserInfo();
  }

  // ฟังก์ชันเพื่อโหลดข้อมูลจาก localStorage และแปลงเป็น JSON
  private loadUserInfo(): void {
    const userInfoJson = localStorage.getItem('userInfo');
    if (userInfoJson) {
      this.userInfo = JSON.parse(userInfoJson);
    } else {
      this.userInfo = null;
    }
  }

  // Getter สำหรับ username
  get username(): string {
    return this.userInfo ? this.userInfo.username : '';
  }

  // Getter สำหรับ role
  get role(): string {
    return this.userInfo ? this.userInfo.role : '';
  }

  // Getter สำหรับ teacher_code
  get teacherCode(): string {
    return this.userInfo ? this.userInfo.teacher_code : '';
  }

  // Getter สำหรับ prefix
  get prefix(): string {
    return this.userInfo ? this.userInfo.prefix : '';
  }

  // Getter สำหรับ firstname
  get firstname(): string {
    return this.userInfo ? this.userInfo.firstname : '';
  }

  // Getter สำหรับ lastname
  get lastname(): string {
    return this.userInfo ? this.userInfo.lastname : '';
  }

  // Getter สำหรับ email
  get email(): string {
    return this.userInfo ? this.userInfo.email : '';
  }

  // Getter สำหรับ active_status
  get activeStatus(): string {
    return this.userInfo ? this.userInfo.active_status : '';
  }
}
