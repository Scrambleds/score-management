import {
  Component,
  ElementRef,
  AfterViewInit,
  Input,
  OnInit,
  Output,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UploadScoreService } from '../../services/upload-score/upload-score.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-upload-score-header',
  standalone: false,
  templateUrl: './upload-score-header.component.html',
  styleUrls: ['./upload-score-header.component.css'],
})
export class UploadScoreHeaderComponent implements OnInit, AfterViewInit {
  @Input() titleName: string = 'No title';
  @Input() buttonName: string = 'No title';

  @Input() isUploaded: boolean = false;

  //viewChild
  @ViewChild('subjectCode', { read: ElementRef }) subjectCodeRef?: ElementRef;
  // @ViewChild('subjectDetailForm', { static: false })
  // subjectDetailFormRef?: NgForm;
  @ViewChild('subjectDetailForm', { static: false })
  subjectDetailForm?: FormGroup;

  @ViewChild('myForm') myForm!: NgForm;
  @Output() formSubmitted = new EventEmitter<any>(); // Emit form data when submitted

  public form: FormGroup;
  filteredSubjects: { subjectCode: string; subjectName: string }[] = [];
  selectedSubjectCode: string = ''; // ตัวแปรที่เก็บค่าที่เลือก

  isAutocompleteVisible = false;
  isSubjectNameReadonly = false;

  isAcademicYearDisabled: boolean = true;
  isSemesterDisabled: boolean = true;
  isSectionIdDisabled: boolean = true;

  academic_yearCodeOptions = [
    { value: null, label: 'กรุณาเลือก' },
    { value: '2022', label: '2565' },
    { value: '2023', label: '2566' },
    { value: '2024', label: '2567' },
    { value: '2025', label: '2568' },
  ];
  semesterCodeOptions = [
    { value: null, label: 'กรุณาเลือก' },
    { value: '1', label: 'ภาคต้น' },
    { value: '2', label: 'ภาคปลาย' },
    { value: '3', label: 'ภาคฤดูร้อน' },
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
    this.form = this.fb.group({
      subjectCode: [''],
      subjectName: [''],
      academic_yearCode: [{ value: null, disabled: true }, Validators.required],
      semesterCode: [{ value: null, disabled: true }, Validators.required],
      sectionId: [{ value: null, disabled: true }, Validators.required],
    });
  }

  ngOnInit() {
    // this.form
    //   .get('subjectCode')!
    //   .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
    //   .subscribe((value) => {
    //     if (value.trim() !== '') {
    //       this.searchSubject(value);
    //     }
    //   });
    console.log('oninit');
  }
  ngAfterViewInit() {
    // ตรวจสอบว่ามี ViewChild หรือไม่
    if (!this.subjectCodeRef) {
      console.error('subjectCodeRef is not defined.');
      return;
    }

    // เข้าถึง input element
    const inputElement =
      this.subjectCodeRef.nativeElement.querySelector('input');
    if (!inputElement) {
      console.error('Input element not found inside subjectCodeRef.');
      return;
    }

    console.log('ngAfterViewInit: Input Element:', inputElement);

    // เพิ่ม Event Listener เพื่อฟังการเปลี่ยนแปลงค่า
    inputElement.addEventListener('input', (event: Event) => {
      const value = (event.target as HTMLInputElement).value.trim();
      console.log('Input Value:', value);

      // อัปเดตสถานะของตัวแปรที่ใช้ควบคุม ng-select
      const isNotEmpty = value.length > 0;
      console.log('Is Input Not Empty:', isNotEmpty);

      // ปรับปรุงการเปิด/ปิด ng-select จาก form control
      if (isNotEmpty) {
        this.form.get('academic_yearCode')?.enable();
        this.form.get('semesterCode')?.enable();
        this.form.get('sectionId')?.enable();
      } else {
        this.form.get('academic_yearCode')?.disable();
        this.form.get('semesterCode')?.disable();
        this.form.get('sectionId')?.disable();
      }
    });
  }

  searchCode(term: string) {
    console.log('search code');
    this.uploadScoreService.searchSubjects(term).subscribe((results) => {
      console.log(results);
      this.filteredSubjects = results;

      if (this.filteredSubjects.length === 1) {
        console.log('filteredSubjects = 1');
        // มีข้อมูลในผลลัพธ์เพียงหนึ่งรายการ
        const subjectCode = this.filteredSubjects[0].subjectCode;
        const subjectName = this.filteredSubjects[0].subjectName;
        if (subjectCode.toUpperCase() === term.toUpperCase()) {
          // เงื่อนไขที่ต้องการตรวจสอบ
          this.form.get('subjectCode')!.setValue(term, { emitEvent: false });
          this.form.get('subjectName')!.setValue(subjectName, {
            emitEvent: false,
          });
          this.isSubjectNameReadonly = true;
        } else {
          // ถ้า subjectCode ไม่ตรงกับที่ต้องการ
          this.isSubjectNameReadonly = false;
          this.form.get('subjectName')!.reset();
        }
      } else if (this.filteredSubjects.length === 0) {
        console.log('filteredSubjects = 0');
        this.form.get('subjectCode')!.setValue(term, { emitEvent: false });
        this.form.get('subjectName')!.reset();
        this.isSubjectNameReadonly = false;
      } else {
        console.log('filteredSubjects = else');
        // มีข้อมูลมากกว่าหนึ่งรายการ
        this.isSubjectNameReadonly = false;
        this.form.get('subjectName')!.reset();
      }
    });
  }

  searchSubject(term: string) {
    console.log('search subject');
    this.uploadScoreService.searchSubjects(term).subscribe((results) => {
      console.log(results);
      this.filteredSubjects = results;

      if (this.filteredSubjects.length === 1) {
        console.log('filteredSubjects = 1');
        // มีข้อมูลในผลลัพธ์เพียงหนึ่งรายการ
        const subjectCode = this.filteredSubjects[0].subjectCode;
        const subjectName = this.filteredSubjects[0].subjectName;
        if (subjectCode.toUpperCase() === term.toUpperCase()) {
          // เงื่อนไขที่ต้องการตรวจสอบ
          this.form.get('subjectName')!.setValue(subjectName, {
            emitEvent: false,
          });
          this.isSubjectNameReadonly = true;
        } else {
          // ถ้า subjectCode ไม่ตรงกับที่ต้องการ
          this.isSubjectNameReadonly = false;
          this.form.get('subjectName')!.setValue(term, {
            emitEvent: false,
          });
        }
      } else if (this.filteredSubjects.length === 0) {
        console.log('filteredSubjects = 0');
        this.form.get('subjectName')!.setValue(term, { emitEvent: false });
      } else {
        console.log('filteredSubjects = else');
        // มีข้อมูลมากกว่าหนึ่งรายการ
        this.isSubjectNameReadonly = false;
        this.form.get('subjectName')!.reset();
      }
    });
  }

  selectSubject(item: any) {
    if (item && item.subjectName) {
      console.log('================selectName=======================');
      console.log(item);
      this.form
        .get('subjectName')!
        .setValue(item.subjectName, { emitEvent: false });
      // this.filteredSubjects = [];
    }
  }

  selectCode(item: any) {
    if (item && item.subjectCode) {
      console.log('================selectCode=======================');
      console.log(item);
      this.form
        .get('subjectName')!
        .setValue(item.subjectName, { emitEvent: false });
      this.form
        .get('subjectCode')!
        .setValue(item.subjectCode, { emitEvent: false });
      this.selectedSubjectCode = item.subjectCode;
      this.isSubjectNameReadonly = true;
      // this.filteredSubjects = [];
    }
  }

  onSelectChange(selectedValue: any, controlName: string): void {
    if (selectedValue && selectedValue.value === null) {
      this.form.get(controlName)?.reset();
    }
  }

  // ฟังก์ชันที่รับข้อมูลจาก select emitter
  onSubjectSelected(selectedItem: any): void {
    this.selectedSubjectCode = selectedItem.subjectCode;
  }

  //autocomplete
  showAutocomplete(): void {
    this.isAutocompleteVisible = true;
  }

  hideAutocomplete(): void {
    // Delay hiding to allow click event on autocomplete items to fire
    setTimeout(() => {
      this.isAutocompleteVisible = false;
    }, 100);
  }

  //end auto complete
  // onSubmit(): void {
  //   if (this.form.valid) {
  //     console.log('Form Submitted:', this.form.value);
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }
  onSubmit() {
    const formData = this.myForm.value;
    console.log('Form Submitted:', formData);

    // Emit form data to parent component
    this.formSubmitted.emit(formData);
  }

  submitForm() {
    if (this.myForm.valid) {
      this.myForm.ngSubmit.emit(); // Trigger the form's submit event
    } else {
      console.log('Form is invalid');
    }
  }
}
