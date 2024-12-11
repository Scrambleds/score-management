import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { ValueCache } from 'ag-grid-community';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  standalone: false,
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
 public form: FormGroup;

  roleOption = [
    { id: '1', label: 'ผู้ดูแลระบบ' },
    { id: '2', label: 'อาจารย์' }
  ];
  
  statusOption = [
    { id: '1', label: 'active' },
    { id: '2', label: 'inactive' }
  ];
  

  constructor(private fb: FormBuilder) {
    // กำหนดโครงสร้างฟอร์มและ Validation
    this.form = this.fb.group({
      teacher_code: [null, Validators.required],
      firstname: [null, Validators.required],
      email: [null, Validators.required],
      role: [null, Validators.required],
      active_status: [null, Validators.required],
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
      teacher_code: null,
      firstname: null,
      email: null,
      role: null,
      active_status: null,
      dropdownField: null, // ค่าที่กำหนดเริ่มต้นสำหรับ dropdown
    });
  }
}