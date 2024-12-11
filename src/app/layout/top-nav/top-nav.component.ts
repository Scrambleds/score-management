import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { LanguageService } from '../../core/services/language.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-top-nav',
  standalone: false,
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css'],
})
export class TopNavComponent implements OnInit {
  currentLang = '';
  currentTitle: string = '';
  @Input() isOpen: boolean = false; // รับค่าจาก Parent
  @Output() toggle = new EventEmitter<void>(); // ส่ง Event กลับไปยัง Parent

  constructor(
    private languageService: LanguageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    // this.currentLang = this.languageService.getCurrentLanguage();
    // console.log('current @ top nav', this.currentLang);
    // this.languageService.setLanguage(this.currentLang);
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(`language`) || 'th';
      this.currentLang = savedLang;
    }

    // โหลดคำแปลของภาษาเริ่มต้นหรือภาษาที่เลือก
    this.translationService.loadTranslations(this.currentLang);
    //set title page
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data['messageKey'];
        })
      )
      .subscribe((key) => {
        this.currentTitle = key || 'No title'; // กำหนดค่าเริ่มต้นในกรณีที่ไม่มี messageKey
      });
  }

  // Function สำหรับ Toggle Side Nav
  toggleNav() {
    this.toggle.emit(); // ส่ง Event กลับไปยัง Parent
  }

  //switch language
  changeLanguage(event: Event, lang: string): void {
    event.preventDefault(); // ป้องกันไม่ให้เกิดการ reload หน้า
    this.translationService.changeLanguage(lang); // ใช้ฟังก์ชันจาก TranslationService
    this.currentLang = lang; // อัปเดตภาษาปัจจุบัน
    localStorage.setItem('language', lang); // เก็บภาษาลงใน localStorage
  }

  onLogout() {
    localStorage.clear(); // Clear token and expiration
    this.router.navigate(['/Login']); // Redirect to login page
  }

}
