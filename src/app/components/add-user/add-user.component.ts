import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  @Input() titleName: string = 'Upload Excel';
  @Input() buttonName: string = 'Upload File';

  @Output() dataUploaded = new EventEmitter<any[]>();  // ส่งข้อมูลไปยัง Parent Component
  @Output() submitRequest = new EventEmitter<void>();
  @Output() isUploaded = new EventEmitter<boolean>();

  rowData: any[] = [];  // ข้อมูลใน ag-Grid
  columnDefs: any[] = [];  // คำนิยามคอลัมน์สำหรับ ag-Grid
  isFileUploaded = false;  // ตรวจสอบว่าไฟล์อัปโหลดแล้วหรือยัง
  requiredFields = [
    'row_id', 'email', 'teacher_code', 'prefix', 'firstname', 'lastname', 'role', 'active_status'
  ];  // ฟีลด์ที่จำเป็นต้องมีในไฟล์ Excel

  form: FormGroup; // Declare form

  constructor(private router: Router, private fb: FormBuilder) {
    // Initialize form here
    this.form = this.fb.group({
      teacher_code: ['', Validators.required],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      active_status: ['', Validators.required]
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  // เมื่อไฟล์ถูกวางลง
  onDrop(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
  
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
  
        // Log the data before emitting
        console.log('Excel Data:', jsonData);
  
        // Validate fields
        if (this.validateFields(jsonData)) {
          // Emit data if valid
          this.dataUploaded.emit(jsonData);
          this.isUploaded.emit(true);  // File uploaded
                Swal.fire({
                  title: 'สำเร็จ',
                  text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                  icon: 'success',
                  confirmButtonText: 'ตกลง',
                  confirmButtonColor: '#007bff'
                });
          this.router.navigate(['/UserManagement']);
        } else {
          alert('Invalid file. Please upload a file with the correct fields.');
          this.isUploaded.emit(false); // File is not valid
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  validateFields(data: any[]): boolean {
    const requiredFields = [
      'row_id', 'email', 'teacher_code', 'prefix', 'firstname', 'lastname', 'role', 'active_status'
    ];
    const fileFields = Object.keys(data[0]);
    return requiredFields.every(field => fileFields.includes(field));
  }
}