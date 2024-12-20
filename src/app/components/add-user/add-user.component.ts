import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchService } from '../../services/search-service/seach.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  @Input() criteria: any;
  @Input() titleName: string = 'Upload Excel';
  @Input() buttonName: string = 'Upload File';

  @Output() dataUploaded = new EventEmitter<any[]>(); // ส่งข้อมูลไปยัง Parent Component
  @Output() submitRequest = new EventEmitter<void>();
  @Output() isUploaded = new EventEmitter<boolean>();

  searchCriteria: any;
  rowData: any[] = []; // ข้อมูลใน ag-Grid
  columnDefs: any[] = []; // คำนิยามคอลัมน์สำหรับ ag-Grid
  originalData: any[] = [];
  filteredData: any[] = [];
  isFileUploaded = false; // ตรวจสอบว่าไฟล์อัปโหลดแล้วหรือยัง
  requiredFields = [
    'ลำดับ',
    'อีเมล',
    'รหัสอาจารย์',
    'คำนำหน้า',
    'ชื่อ',
    'นามสกุล',
    'หน้าที่',
    'สถานะการใช้งาน',
  ];

  defaultColDef = {
    sortable: true,
    resizable: true,
  };

  form: FormGroup; // Declare form

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private searchService: SearchService
  ) {
    // Initialize form here
    this.form = this.fb.group({
      teacher_code: ['', Validators.required],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      active_status: ['', Validators.required],
    });
  }

  initGrid() {
    this.columnDefs = Object.keys(this.originalData[0]).map((key) => ({
      field: key,
      headerName: key,
      sortable: true,
      filter: true,
    }));
  }

  ngOnInit() {
    this.searchService.currentSearchCriteria.subscribe((criteria) => {
      console.log('Updated criteria:', criteria);
      console.log('Original criteria:', this.originalData);
      if (criteria) {
        this.searchCriteria = criteria;
        this.filteredData = this.filterData(this.originalData, criteria);
        this.rowData = [...this.filteredData]; // อัปเดตข้อมูลใน ag-Grid
      }
    });
  }
  
  // filterData(data: any[], criteria: any): any[] {
  //   return data.filter((item) => {
  //     const fullname = `${item['คำนำหน้า']} ${item['ชื่อ']} ${item['นามสกุล']}`.toLowerCase();
  //     return (
  //       (!criteria.teacher_code || item['รหัสอาจารย์']?.includes(criteria.teacher_code)) &&
  //       (!criteria.email || item['อีเมล']?.includes(criteria.email)) &&
  //       (!criteria.role || item['หน้าที่'] === criteria.role) &&
  //       (!criteria.active_status || item['สถานะการใช้งาน'] === criteria.active_status) &&
  //       (!criteria.fullname || fullname.includes(criteria.fullname.toLowerCase())),
  //       console.log('Criteria:', criteria),
  //       console.log('Original Data:', data),
  //       console.log('Filtered Data:', this.filteredData)
  //     );
  //   });
  // }

  // การกรองข้อมูลถ้า "searchCriteria" มีค่าต่างๆ

  ngOnChanges(): void {
    if (this.criteria) {
      console.log('Criteria updated:', this.criteria);
      // กรองข้อมูลใหม่ทุกครั้งที่ criteria เปลี่ยน
      this.filteredData = this.filterData(this.originalData, this.criteria);
      this.rowData = [...this.filteredData]; // อัปเดตข้อมูลใน ag-Grid
    } else {
      // ถ้าไม่มี criteria หรือเป็นค่าว่าง ให้แสดงข้อมูลทั้งหมด
      this.filteredData = [...this.originalData];
      this.rowData = [...this.originalData];
    }
  }

  updateCriteria(newCriteria: any): void {
    this.criteria = newCriteria;
    // กรองข้อมูลตาม criteria ใหม่
    this.filteredData = this.filterData(this.originalData, this.criteria);
    this.rowData = [...this.filteredData]; // อัปเดตข้อมูลใน ag-Grid
  }

  // ฟังก์ชันกรองข้อมูล
  filterData(data: any[], criteria: any): any[] {
    console.log('Data being filtered:', data);
    console.log('Filtering criteria:', criteria);
  
    // หาก criteria เป็นค่าว่างทั้งหมดยังไม่ทำการกรอง
    if (!criteria.teacher_code && !criteria.fullname && !criteria.email && !criteria.role && !criteria.active_status) {
      return data;
    }
  
    return data.filter((item) => {
      const fullname = `${item['คำนำหน้า'] || ''} ${item['ชื่อ'] || ''} ${item['นามสกุล'] || ''}`.toLowerCase();
  
      const isMatching =
        (!criteria.teacher_code || (item['รหัสอาจารย์']?.toLowerCase().includes(criteria.teacher_code?.toLowerCase()))) &&
        (!criteria.email || (item['อีเมล']?.toLowerCase().includes(criteria.email?.toLowerCase()))) &&
        (!criteria.role || item['หน้าที่'] === criteria.role) &&
        (!criteria.active_status || item['สถานะการใช้งาน'] === criteria.active_status) &&
        (!criteria.fullname || fullname.includes(criteria.fullname?.toLowerCase()));
  
      return isMatching;
    });
  }
  

  matchAnyField(searchString: string, item: any): boolean {
    const lowerCaseSearchString = searchString.toLowerCase();

    const fullName =
      `${item.prefix} ${item.firstname} ${item.lastname}`.toLowerCase();
    return fullName.includes(lowerCaseSearchString);
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

        if (this.validateFields(jsonData)) {
          const modifiedData = this.processData(jsonData);

          this.LoadGridData(modifiedData);
          this.isFileUploaded = true;
          this.isUploaded.emit(true);
        } else {
          alert('ไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ที่มีฟิลด์ครบถ้วน');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }

  processData(data: any[]): any[] {
    return data.map((row) => ({
      ลำดับ: row['ลำดับ'],
      รหัสอาจารย์: row['รหัสอาจารย์'], // เปลี่ยนจาก 'teacher_code'
      คำนำหน้า: row['คำนำหน้า'],
      ชื่อ: row['ชื่อ'], // เปลี่ยนจาก 'fullname'
      นามสกุล: row['นามสกุล'],
      อีเมล: row['อีเมล'], // เปลี่ยนจาก 'email'
      หน้าที่: row['หน้าที่'], // เปลี่ยนจาก 'role'
      สถานะการใช้งาน: row['สถานะการใช้งาน'], // เปลี่ยนจาก 'active_status'
    }));
  }
  

  LoadGridData(data: any[]) {
    if (data.length > 0) {
      console.log(data);

      this.columnDefs = Object.keys(data[0]).map((key) => {
        let customWidth = 100;
        let flexValue = 1;
        let cellClass = '';
        switch (key) {
          case 'ลำดับ':
            customWidth = 70;
            flexValue = 0.3; // ความยืดหยุ่นเล็กกว่า
            break;
          case 'อีเมล':
            customWidth = 70;
            flexValue = 1.7; // ขยายความกว้าง
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
      this.originalData = data;
      console.log(this.rowData);
      console.log('Original criteria:', this.originalData);

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
      'ลำดับ',
      'อีเมล',
      'รหัสอาจารย์',
      'คำนำหน้า',
      'ชื่อ',
      'นามสกุล',
      'หน้าที่',
      'สถานะการใช้งาน',
    ];
    return requiredFields.every((field) => field in data[0]);
    // const fileFields = Object.keys(data[0]);
    // return requiredFields.every(field => fileFields.includes(field));
  }
}
