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
    'ลำดับ', 'อีเมล', 'รหัสอาจารย์', 'คำนำหน้า', 'ชื่อ', 'นามสกุล', 'หน้าที่', 'สถานะการใช้งาน'
  ]; 

  defaultColDef = {
    sortable: true,
    resizeable: true,
  }

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
  
        // console.log('Excel Data:', jsonData);
  
        // if (this.validateFields(jsonData)) {
        //   this.dataUploaded.emit(jsonData);
        //   this.isUploaded.emit(true); 
        //         Swal.fire({
        //           title: 'สำเร็จ',
        //           text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
        //           icon: 'success',
        //           confirmButtonText: 'ตกลง',
        //           confirmButtonColor: '#007bff'
        //         });
        //   this.router.navigate(['/UserManagement']);
        // } else {
        //   alert('Invalid file. Please upload a file with the correct fields.');
        //   this.isUploaded.emit(false); // File is not valid
        // }

        if(this.validateFields(jsonData)){
          const modifiedData = this.processData(jsonData);

          this.LoadGridData(modifiedData);
          this.isFileUploaded = true;
          this.isUploaded.emit(true);
        }
        else{
          alert('ไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ที่มีฟิลด์ครบถ้วน');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  processData(data: any[]): any[]{
    return data.map((row) => {

      return {
        ลำดับ: row['ลำดับ'],
        รหัสอาจารย์: row['รหัสอาจารย์'],
        คำนำหน้า: row['คำนำหน้า'],
        ชื่อ: row['ชื่อ'],
        นามสกุล: row['นามสกุล'],
        อีเมล: row['อีเมล'],
        หน้าที่: row['หน้าที่'],
        สถานะการใช้งาน: row['สถานะการใช้งาน'],
      };
    });
  }

  LoadGridData(data: any[]){
    if(data.length > 0){
      console.log(data);

      this.columnDefs = Object.keys(data[0]).map((key) => {
        let customWidth = 100;
        let flexValue = 1;
        let cellClass = '';
        switch(key){
          case 'ลำดับ':
            customWidth = 70;
            flexValue = 0.3; // ความยืดหยุ่นเล็กกว่า
            break;
          case 'อีเมล':
            customWidth = 70;
            flexValue = 1.7 // ขยายความกว้าง
            break;
          case 'รหัสอาจารย์':
            customWidth = 70;
            flexValue = 0.8; // ขนาดปานกลาง
            break;
          case 'คำนำหน้า':
            customWidth = 70;
            flexValue = 0.6; // ขนาดปานกลาง
            break;
          case 'ชื่อ':
            customWidth = 70;
            flexValue = 1.2; // ขนาดปานกลาง
            break;
          case 'นามสกุล':
            customWidth = 70;
            flexValue = 1.2; // ความกว้างมากที่สุด
            break;
          case 'หน้าที่':
            customWidth = 70;
            flexValue = 0.8; // ค่า flex เท่ากัน
            cellClass = 'text-end'; // เพิ่มคลาสสำหรับการจัดข้อความ
            break;
          case 'สถานะการใช้งาน':
            customWidth = 70;
            flexValue = 0.8; // ค่า flex เท่ากัน
            cellClass = 'text-end'; // เพิ่มคลาสสำหรับการจัดข้อความ
            break;
          default:
            customWidth = 160;
        }
        return {
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          flex: flexValue, // ใช้ flex แทน width
          minWidth: customWidth, // กำหนดความกว้างขั้นต่ำ
          // width: customWidth, // กำหนดความกว้าง
          cellClass: cellClass, // เพิ่มคลาส
        };
      });
      this.rowData = data;
      // this.originalData = data;
      console.log(this.rowData);
    }
  }

    onDelete() {
      Swal.fire({
        title: 'ต้องการลบข้อมูลใช่หรือไม่',
        text: 'หลังจากลบข้อมูลแล้วจะไม่สามารถกลับมาแก้ไขได้',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Delete',
        cancelButtonColor: 'var(--secondary-color)',
        cancelButtonText: 'ยกเลิก',
      }).then((result) => {
        if (result.isConfirmed) {
          // หากคลิก "ตกลง"
          this.rowData = []; // ล้างข้อมูลทั้งหมดจาก ag-Grid
          this.isFileUploaded = false; // ปรับ flag เพื่อแสดง UI สำหรับการอัปโหลดไฟล์ใหม่
          this.isUploaded.emit(false); // แจ้ง Parent ว่าไฟล์ถูกอัปโหลดสำเร็จ
          console.log(this.rowData);
          console.log('ข้อมูลถูกลบแล้ว');
        } else if (result.isDismissed) {
          // หากคลิก "ยกเลิก"
          console.log('การบันทึกถูกยกเลิก');
        }
      });
    }

  validateFields(data: any[]): boolean {
    const requiredFields = [
      'ลำดับ', 'อีเมล', 'รหัสอาจารย์', 'คำนำหน้า', 'ชื่อ', 'นามสกุล', 'หน้าที่', 'สถานะการใช้งาน'
    ];
    const fileFields = Object.keys(data[0]);
    return requiredFields.every(field => fileFields.includes(field));
  }
}