import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadScoreService } from '../../services/upload-score/upload-score.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-upload-score-header',
  standalone: false,
  templateUrl: './upload-score-header.component.html',
  styleUrls: ['./upload-score-header.component.css'],
})
export class UploadScoreHeaderComponent implements OnInit {
  @Input() titleName: string = 'No title';
  @Input() buttonName: string = 'No title';

  public form: FormGroup;
  filteredSubjects: { subjectCode: string; subjectName: string }[] = [];
  selectedSubjectCode: string = ''; // ตัวแปรที่เก็บค่าที่เลือก

  isAutocompleteVisible = false;
  isSubjectNameReadonly = false;

  isAcademicYearDisabled: boolean = true;
  isSemesterDisabled: boolean = true;
  sectionIdDisabled: boolean = true;

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
    this.form = this.fb.group({
      subjectNo: [''],
      subjectName: [''],
      academic_yearCode: [
        { value: null, disabled: this.isAcademicYearDisabled },
        Validators.required,
      ],
      semesterCode: [
        { value: null, disabled: this.isSemesterDisabled },
        Validators.required,
      ],
      sectionId: [
        { value: null, disabled: this.sectionIdDisabled },
        Validators.required,
      ],
    });
  }

  ngOnInit() {
    this.form
      .get('subjectNo')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value.trim() !== '') {
          this.searchSubject(value);
        }
      });
    console.log('oninit');
  }
  searchSubject(term: string) {
    console.log('search subject');
    this.uploadScoreService.searchSubjects(term).subscribe((results) => {
      console.log(results);
      this.filteredSubjects = results;

      if (this.filteredSubjects.length === 1) {
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
          this.form.get('subjectName')!.reset();
        }
      } else {
        // มีข้อมูลมากกว่าหนึ่งรายการ
        this.isSubjectNameReadonly = false;
        this.form.get('subjectName')!.reset();
      }
    });
  }
  selectSubject(item: any) {
    // this.form.get('subjectNo')!.setValue(subjectCode, { emitEvent: false });
    this.isSubjectNameReadonly = true;
    this.filteredSubjects = [];
    console.log(item);
  }
  // selectSubject(subjectCode: string, subjectName: string) {
  //   // this.form.get('subjectNo')!.setValue(subjectCode, { emitEvent: false });
  //   console.log(subjectCode, subjectName);
  //   this.form.get('subjectName')!.setValue(subjectName, { emitEvent: false });
  //   this.isSubjectNameReadonly = true;
  //   this.filteredSubjects = [];
  // }
  selectCode(item: any) {
    if (item && item.subjectCode) {
      console.log('================selectCode=======================');
      console.log(item);
      this.form
        .get('subjectName')!
        .setValue(item.subjectName, { emitEvent: false });
      // this.form.get('subjectCode')!.setValue(subjectCode, { emitEvent: false });
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
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
