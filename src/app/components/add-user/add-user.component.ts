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
import { AddUserService } from '../../services/add-user/add-user.service';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit {
  @Input() criteria: any;
  @Input() titleName: string = 'อัปโหลดไฟล์ข้อมูลบัญชีผู้ใช้';
  @Input() buttonName: string = 'อัปโหลดไฟล์ Excel';

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
    'row_id',
    'email',
    'teacher_code',
    'prefix',
    'firstname',
    'lastname',
    'role',
    'active_status',
  ];

  defaultColDef = {
    sortable: true,
    resizable: true,
  };

  form: FormGroup; // Declare form

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private searchService: SearchService,
    private addUserService: AddUserService
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
    if (
      !criteria.teacher_code &&
      !criteria.fullname &&
      !criteria.email &&
      !criteria.role &&
      !criteria.active_status
    ) {
      return data;
    }

    return data.filter((item) => {
      const fullname = `${item['prefix'] || ''} ${item['firstname'] || ''} ${
        item['lastname'] || ''
      }`.toLowerCase();

      const isMatching =
        (!criteria.teacher_code ||
          item['teacher_code']
            ?.toLowerCase()
            .includes(criteria.teacher_code?.toLowerCase())) &&
        (!criteria.email ||
          item['email']
            ?.toLowerCase()
            .includes(criteria.email?.toLowerCase())) &&
        (!criteria.role || item['role'] === criteria.role) &&
        (!criteria.active_status ||
          item['active_status'] === criteria.active_status) &&
        (!criteria.fullname ||
          fullname.includes(criteria.fullname?.toLowerCase()));

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
    return data.map((row, index) => ({
      row_id: index + 1,
      role: row['role'],
      teacher_code: row['teacher_code'],
      prefix: row['prefix'],
      firstname: row['firstname'],
      lastname: row['lastname'],
      email: row['email'],
      active_status: row['active_status']
    }));
  }

  LoadGridData(data: any[]) {
    if (data.length > 0) {
      console.log('Original data: ', data);

      // คำนิยามคอลัมน์ที่แสดงใน ag-Grid เป็นภาษาไทย
      this.columnDefs = Object.keys(data[0]).map((key) => {
        let customWidth = 100;
        let flexValue = 1;
        let cellClass = '';
        let headerName = '';

        switch (key) {
          case 'row_id':
            headerName = 'ลำดับ';
            customWidth = 70;
            flexValue = 0.3;
            break;
          case 'email':
            headerName = 'อีเมล';
            customWidth = 70;
            flexValue = 1.7;
            break;
          case 'teacher_code':
            headerName = 'รหัสอาจารย์';
            customWidth = 70;
            flexValue = 0.8;
            break;
          case 'prefix':
            headerName = 'คำนำหน้า';
            customWidth = 70;
            flexValue = 0.6;
            break;
          case 'firstname':
            headerName = 'ชื่อ';
            customWidth = 70;
            flexValue = 1.2;
            break;
          case 'lastname':
            headerName = 'นามสกุล';
            customWidth = 70;
            flexValue = 1.2;
            break;
          case 'role':
            headerName = 'หน้าที่';
            customWidth = 70;
            flexValue = 0.8;
            cellClass = 'text-end';
            break;
          case 'active_status':
            headerName = 'สถานะการใช้งาน';
            customWidth = 70;
            flexValue = 0.8;
            cellClass = 'text-end';
            break;
          default:
            headerName = key;
            customWidth = 160;
        }

        return {
          field: key, // ชื่อฟิลด์ที่ใช้ใน API
          headerName: headerName, // ชื่อที่แสดงใน ag-Grid
          editable: true,
          flex: flexValue,
          minWidth: customWidth,
          cellRenderer: (params: any) => {
            const value = params.value?.toString().trim();
            if (value === '' || value === null || value === undefined) {
              return '<span style="color: red; font-weight: bold; background-color: #ffcccc; padding: 2px 5px; border-radius: 3px;">NULL</span>';
            } else if (value === '-') {
              return '<span style="color: red; font-weight: bold;">-</span>';
            }
            return params.value;
          },
        };
      });

      // Processed Data
      const processedData = data.map((row) => {
        const updatedRow: any = {};
        Object.keys(row).forEach((key) => {
          updatedRow[key] =
            row[key]?.toString().trim() === '' ? null : row[key];
        });
        return updatedRow;
      });

      this.rowData = processedData;
      this.originalData = processedData;
      console.log(this.rowData);
    } else {
      console.log('No data to load');
    }
  }

  onCellValueChanged(event: any) {
    console.log('Cell value changed', event);
  }

  onSaveData() {
    // ตรวจสอบว่ามีข้อมูลในตารางหรือไม่
    if (!this.rowData || this.rowData.length === 0) {
      Swal.fire({
        title: 'ไม่มีข้อมูล',
        text: 'กรุณาอัปโหลดข้อมูลก่อนบันทึก',
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    // ตรวจสอบฟิลด์ที่ว่างเปล่าในแต่ละแถว
    const missingFields: string[] = [];
    this.rowData.forEach((row, index) => {
      this.requiredFields.forEach((field) => {
        if (
          !row[field] ||
          row[field].toString().trim() === '' ||
          row[field].toString().trim() === 'NULL'
        ) {
          missingFields.push(`แถวที่ ${index + 1}: ${field}`);
        }
      });
    });

    // หากมีฟิลด์ที่ว่างเปล่า แสดงการแจ้งเตือน
    if (missingFields.length > 0) {
      Swal.fire({
        title: 'ข้อมูลไม่ครบถ้วน',
        html: `พบฟิลด์ที่ยังไม่ได้กรอก:<br>${missingFields.join('<br>')}`,
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });
      return;
    }
    const createBy = localStorage.getItem('username') || 'admin'; // ค่า default เป็น 'admin' ถ้าไม่พบค่าใน localStorage

    const dataToSend = this.rowData.map((row) => {
      const { create_date, ...filteredRow } = row;
      return { ...filteredRow, create_by: createBy };
    });

    this.addUserService.insertUser(dataToSend).subscribe(
      (response) => {
        Swal.fire({
          title: 'บันทึกข้อมูลสำเร็จ',
          text: 'ข้อมูลถูกบันทึกเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        }).then(() => {
          // หลังจากการบันทึกเสร็จแล้ว นำทางไปยังหน้าที่ต้องการ
          this.router.navigate(['/UserManagement']);
        });
      },
      (error) => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถบันทึกข้อมูลได้ โปรดลองอีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });
      }
    );
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
      
        this.rowData = []; 
        this.isFileUploaded = false; 
        this.isUploaded.emit(false); 
        console.log(this.rowData);
        console.log('ข้อมูลถูกลบแล้ว');
      } else if (result.isDismissed) {
     
        console.log('การบันทึกถูกยกเลิก');
      }
    });
  }

  validateFields(data: any[]): boolean {
    const requiredFields = [
      'row_id',
      'email',
      'teacher_code',
      'prefix',
      'firstname',
      'lastname',
      'role',
      'active_status',
    ];
    return requiredFields.every((field) => field in data[0]);
  }
}