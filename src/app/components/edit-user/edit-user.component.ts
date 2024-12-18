import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Component, EventEmitter, HostListener, Input, output, Output } from '@angular/core';
import { SearchService } from '../../services/search-service/seach.service'
import { Router } from '@angular/router';
import { UserManageService } from '../../services/user-manage/user-manage.service';

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
  
  roleOption = [{ id: 'ผู้ดูแลระบบ', title: 'ผู้ดูแลระบบ' }, { id: 'อาจารย์', title: 'อาจารย์' }];
  statusOption = [{ id: 'active', title: 'active' }, { id: 'inactive', title: 'inactive' }];

  rowData: any[] = [];
  originalData: any[] = [];
  filteredData: any[] = [];
  

  constructor(private UserManageService: UserManageService ,private fb: FormBuilder, private router: Router, private searchService: SearchService){
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

private splitFullname(fullname: string): { prefix: string, firstname: string, lastname: string } {
  const [prefix = '', firstname = '', ...rest] = fullname.split(' ').filter(Boolean);
  return { prefix, firstname, lastname: rest.join(' ') };
}

// ฟังก์ชันในการค้นหาข้อมูล
// onSearch(): void {
//   if (this.form.valid) {
//     const searchCriteria = this.form.value;
//     const fullname = searchCriteria.fullname ? searchCriteria.fullname.trim() : '';
//     // this.searchEvent.emit(searchCriteria);

//     this.searchService.updateSearchCriteria(this.form.value);
//     // อัพเดต search criteria โดยใช้ fullname ในการค้นหาคำ
//     this.searchService.updateSearchCriteria({
//       teacher_code: searchCriteria.teacher_code,
//       fullname: fullname,  // ส่ง fullname ไปยัง searchCriteria
//       email: searchCriteria.email,
//       role: searchCriteria.role,
//       active_status: searchCriteria.active_status
//     });

//     // ฟิลเตอร์ข้อมูลจาก originalData
//     this.filteredData = this.filterData(this.originalData, {
//       ...searchCriteria,
//       fullname
//     });

//     console.log('ส่งข้อมูล:', searchCriteria);
//   } else {
//     console.log('กรุณากรอกข้อมูลให้ครบถ้วน');
//     this.searchService.updateSearchCriteria({});
//   }
// }

// onSearch(): void {
//   if (this.form.valid) {
//     const searchCriteria = this.form.value;
//     const fullname = searchCriteria.fullname ? searchCriteria.fullname.trim() : '';
//     this.searchService.updateSearchCriteria({
//       ...searchCriteria,
//       fullname,
//     });
//     console.log('Search criteria updated:', searchCriteria);

//   } else {
//     console.log('กรุณากรอกข้อมูลให้ครบถ้วน');
//   }
// }

// เมื่อทำการค้นหาใน edit-user

onSearch(): void {
  if (this.form.valid) {
    const searchCriteria = this.form.value;

    // แปลงคีย์จาก form ให้ตรงกับ data
    const cleanedCriteria = {
      teacher_code: searchCriteria.teacher_code || '',
      fullname: searchCriteria.fullname?.trim() || '',
      email: searchCriteria.email || '',
      role: searchCriteria.role || '',
      active_status: searchCriteria.active_status || '',
    };

    // อัปเดต criteria ที่ใช้ในการกรอง
    this.searchService.updateSearchCriteria(cleanedCriteria);
    console.log('Updated search criteria:', cleanedCriteria);
  } else {
    console.log('กรุณากรอกข้อมูลให้ครบถ้วน');
    this.searchService.updateSearchCriteria({}); // รีเซ็ต criteria ถ้าฟอร์มไม่ครบ
  }
}

  // ฟังก์ชันรีเซ็ตฟอร์ม
  // onReset(): void {
  //   this.router.navigate(['/UserManagement']);  // กลับไปที่หน้าเดิม
  //   this.form.reset();  // รีเซ็ตฟอร์ม

  //   // คืนค่าข้อมูลทั้งหมด
  //   this.filteredData = [...this.originalData];  // ใช้ข้อมูลต้นฉบับ
  //   this.searchService.updateSearchCriteria({});  // รีเซ็ต criteria
  // }

  onReset(): void {
    this.form.reset();
    this.filteredData = [...this.originalData]; // คืนค่าข้อมูลทั้งหมด
    this.rowData = [...this.originalData];
    this.searchService.updateSearchCriteria({});  // รีเซ็ต criteria
  }  

  // ngOnInit() {
  //   // ดึงข้อมูลทั้งหมดจาก API
  //   this.UserManageService.getUsers().subscribe({
  //     next: (response: any) => {
  //       if (response.isSuccess) {
  //         this.originalData = response.objectResponse;  // เก็บข้อมูลทั้งหมด
  //         this.filteredData = [...this.originalData];  // เริ่มต้นให้แสดงข้อมูลทั้งหมด
  //       } else {
  //         console.error('ไม่สามารถดึงข้อมูลได้', response.message);
  //       }
  //     },
  //     error: err => {
  //       console.error('API Error:', err);
  //     }
  //   });
  // }

  // ฟังก์ชันฟิลเตอร์ข้อมูล
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
  
    // รวม prefix, firstname, lastname และทำการค้นหาคำในทุกฟิลด์
    const fullName = `${item.prefix} ${item.firstname} ${item.lastname}`.toLowerCase();
    return fullName.includes(lowerCaseSearchString);
  }
}