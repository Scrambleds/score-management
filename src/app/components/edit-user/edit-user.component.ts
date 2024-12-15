import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Component, EventEmitter, HostListener, Input, output, Output } from '@angular/core';
import { ValueCache } from 'ag-grid-community';
import { SearchService } from '../../services/search-service/seach.service'
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  standalone: false,
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
 public form: FormGroup;
  submittedData: any = null;
  @Output() searchEvent = new EventEmitter<any>(); 
  @Output() submit = new EventEmitter<any>();

  roleOption = [
    { id: '1', label: 'ผู้ดูแลระบบ' },
    { id: '2', label: 'อาจารย์' }
  ];
  
  statusOption = [
    { id: '1', label: 'active' },
    { id: '2', label: 'inactive' }
  ];
  

  constructor(private fb: FormBuilder, private router: Router, private searchService: SearchService){
    // กำหนดโครงสร้างฟอร์มและ Validation
    this.form = this.fb.group({
      teacher_code: [null],
      fullname: [null],
      email: [null],
      role: [null],
      active_status: [null],
      dropdownField: [null], // เพิ่ม dropdown ให้รองรับ reset
    });
  }

  // Handle form submission
  // onSubmit(): void {
  //   if (this.form.valid) {
  //     console.log('Form Submitted:', this.form.value);
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }

// ฟังก์ชันแยก fullname ออกเป็น prefix, firstname, lastname
private splitFullname(fullname: string): [string, string, string] {
  const nameParts = fullname.split(' ').filter(part => part.trim() !== '');

  let prefix = '';
  let firstname = '';
  let lastname = '';

  if (nameParts.length >= 1) prefix = nameParts[0];  // คำนำหน้าชื่อ
  if (nameParts.length >= 2) firstname = nameParts[1];  // ชื่อ
  if (nameParts.length >= 3) lastname = nameParts.slice(2).join(' ');  // นามสกุล (กรณีที่มี 3 คำขึ้นไป)

  return [prefix, firstname, lastname];
}

// ฟังก์ชันในการค้นหาข้อมูล
onSearch(): void {
  if (this.form.valid) {
    const searchCriteria = this.form.value;
    const fullname = searchCriteria.fullname ? searchCriteria.fullname.trim() : '';

    // อัพเดต search criteria โดยใช้ fullname ในการค้นหาคำ
    this.searchService.updateSearchCriteria({
      teacher_code: searchCriteria.teacher_code,
      fullname: fullname, // ส่ง fullname ไปยัง searchCriteria
      email: searchCriteria.email,
      role: searchCriteria.role,
      active_status: searchCriteria.active_status
    });

    console.log('ส่งข้อมูล:', searchCriteria);
  } else {
    console.log('กรุณากรอกข้อมูลให้ครบถ้วน');
    this.searchService.updateSearchCriteria({});
  }
}

  // ฟังก์ชันรีเซ็ตฟอร์ม
  onReset(): void {
    this.form.reset({
      fullname: null,
      email: null,
      role: null,
      active_status: null,
      dropdownField: null,
    });
    this.searchService.updateSearchCriteria({});
  }
}