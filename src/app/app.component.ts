import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  searchCriteria: any = {};

  onSearch(criteria: any) {
    this.searchCriteria = criteria; // รับข้อมูลจาก EditUserComponent
  }

  title = 'score-management';
  // isNavOpen = false; // ควบคุมสถานะของ side navigation bar

  // onNavToggle(isOpen: boolean): void {
  //   this.isNavOpen = isOpen; // รับสถานะเปิด/ปิดจาก EventEmitter
  // }
  isOpen: boolean = false;
  isLoginPage: boolean  = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // ตรวจสอบเส้นทางปัจจุบัน
      this.isLoginPage = this.router.url === '/Login';
    });
  }
  toggleNav() {
    this.isOpen = !this.isOpen;
  }
}
