import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'score-management';
  // isNavOpen = false; // ควบคุมสถานะของ side navigation bar

  // onNavToggle(isOpen: boolean): void {
  //   this.isNavOpen = isOpen; // รับสถานะเปิด/ปิดจาก EventEmitter
  // }
  isOpen: boolean = false;

  toggleNav() {
    this.isOpen = !this.isOpen;
  }
}
