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
  isAutocompleteVisible = false;

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
      academic_yearCode: [null, Validators.required],
      semesterCode: [null, Validators.required],
      sectionId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.form
      .get('subjectNo')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.searchSubject(value));
  }

  searchSubject(term: string) {
    this.uploadScoreService.searchSubjects(term).subscribe((results) => {
      this.filteredSubjects = results;
    });
  }

  selectSubject(subjectCode: string, subjectName: string) {
    this.form.get('subjectNo')!.setValue(subjectCode, { emitEvent: false });
    this.form.get('subjectName')!.setValue(subjectName, { emitEvent: false });
    this.filteredSubjects = [];
  }

  onSelectChange(selectedValue: any, controlName: string): void {
    if (selectedValue && selectedValue.value === null) {
      this.form.get(controlName)?.reset();
    }
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
