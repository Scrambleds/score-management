import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadScoreService } from '../../services/upload-score/upload-score.service';
import { BehaviorSubject, debounceTime, switchMap } from 'rxjs';

@Component({
  selector: 'app-upload-score-header',
  standalone: false,

  templateUrl: './upload-score-header.component.html',
  styleUrl: './upload-score-header.component.css',
})
export class UploadScoreHeaderComponent implements OnInit {
  @Input() titleName: string = 'No title'; // รับค่าจาก Parent
  @Input() buttonName: string = 'No title'; // รับค่าจาก Parent

  public form: FormGroup;
  subjectOptions: any[] = []; // ตัวแปรเก็บข้อมูลวิชาและรหัสวิชา
  searchSubject$: BehaviorSubject<string> = new BehaviorSubject<string>(''); // ใช้ BehaviorSubject

  academic_yearCodeOptions = [
    { value: null, label: 'กรุณาเลือก' },
    { value: '2022', label: '2565' },
    { value: '2023', label: '2566' },
    { value: '2024', label: '2567' },
    { value: '2025', label: '2568' },
  ];
  semesterCodeOptions = [
    { value: null, label: 'กรุณาเลือก' },
    { value: '801', label: 'ภาคต้น' },
    { value: '870', label: 'ภาคปลาย' },
  ];
  sectionIdOptions = [
    { value: null, label: 'กรุณาเลือก' },
    { value: '800', label: '800' },
    { value: '801', label: '801' },
    { value: '870', label: '870' },
    { value: '880', label: '880' },
  ];

  constructor(
    private fb: FormBuilder,
    private uploadScoreService: UploadScoreService
  ) {
    // กำหนดโครงสร้างฟอร์มและ Validation
    this.form = this.fb.group({
      subjectNo: [''],
      subjectName: [''],
      academic_yearCode: [null, Validators.required], // เพิ่ม dropdown ให้รองรับ reset
      semesterCode: [null, Validators.required], // เพิ่ม dropdown ให้รองรับ reset
      sectionId: [null, Validators.required], // เพิ่ม dropdown ให้รองรับ reset
    });
  }

  ngOnInit() {
    // เรียกบริการเพื่อดึงข้อมูลวิชา
    // เมื่อพิมพ์คำค้นหาใน input field จะส่งคำไปที่ BehaviorSubject
    this.searchSubject$
      .pipe(
        debounceTime(300), // หน่วงเวลา 300ms ก่อนทำการค้นหา
        switchMap((term) => this.uploadScoreService.searchSubjects(term)) // ค้นหาข้อมูลจาก service
      )
      .subscribe((data) => {
        this.subjectOptions = data; // กำหนดค่าที่ค้นหามาให้กับ subjectOptions
      });
  }

  // ฟังก์ชันในการค้นหาวิชาตามคำที่พิมพ์
  searchSubject(term: string) {
    this.searchSubject$.next(term); // ส่งคำที่พิมพ์ไปที่ BehaviorSubject
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }
  // ฟังก์ชันจัดการเมื่อมีการเปลี่ยนแปลงค่าใน ng-select
  onSelectChange(selectedValue: any, controlName: string): void {
    if (selectedValue && selectedValue.value === null) {
      this.form.get(controlName)?.reset(); // รีเซ็ตฟอร์มตามชื่อ control
    }
  }
}
