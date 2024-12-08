import { Component, Output, EventEmitter } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-top-nav',
  standalone: false,
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent {
  @Output() navToggle = new EventEmitter<boolean>();
  isOpen = false;
  //default lang
  currentLang = '';

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.languageService.setLanguage(this.currentLang);
  }

  //collapse side bar
  toggleNav(): void {
    this.isOpen = !this.isOpen;
    this.navToggle.emit(this.isOpen); // ส่งสถานะเปิด/ปิดไปยัง AppComponent
  }

  //switch language
  changeLanguage(lang: string): void {
    this.languageService.setLanguage(lang);
    this.currentLang = lang;
  }
}
