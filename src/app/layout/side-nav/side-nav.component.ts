import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  standalone: false,
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css'],
})
export class SideNavComponent {
  @Input() isOpen: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  // Close navigation
  closeNav() {
    this.toggle.emit(); // ส่ง Event กลับไปยัง Parent
  }
}
