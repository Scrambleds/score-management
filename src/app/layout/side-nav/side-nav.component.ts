import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  @Input() isOpen = false; // รับสถานะจาก AppComponent
  @Output() navToggle = new EventEmitter<boolean>();

  toggleNav(): void {
    this.isOpen = !this.isOpen;
    this.navToggle.emit(this.isOpen); // ส่งสถานะกลับไปยัง AppComponent
  }
}
