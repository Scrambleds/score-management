import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  standalone: false,
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
 public form: FormGroup;

  // ตัวเลือก dropdown
  options = [
    { value: 'option1', label: 'ตัวเลือกที่ 1' },
    { value: 'option2', label: 'ตัวเลือกที่ 2' },
    { value: 'option3', label: 'ตัวเลือกที่ 3' },
  ];

  constructor(private fb: FormBuilder) {
    // กำหนดโครงสร้างฟอร์มและ Validation
    this.form = this.fb.group({
      citizenId: [
        null,
        [Validators.required, Validators.pattern(/^\d{13}$/)] // Validation: ต้องเป็นตัวเลข 13 หลัก
      ],
      dropdownField: ['option1', Validators.required], // เพิ่ม dropdown ให้รองรับ reset
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  // Reset form fields
  onReset(): void {
    // กำหนดค่าฟอร์มเริ่มต้น
    this.form.reset({
      citizenId: null,
      dropdownField: null, // ค่าที่กำหนดเริ่มต้นสำหรับ dropdown
    });
  }
}