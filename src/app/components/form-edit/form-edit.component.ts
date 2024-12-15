import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { SearchService } from '../../services/search-service/seach.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-edit',
  standalone: false,
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css']
})
export class FormEditComponent implements OnInit, AfterViewInit {

  isUploadExcelVisible = false;
  isModalVisible = false;
  selectedRowData: any = null;
  modalElement: any;
  modalInstance: any;
  searchCriteria: any;
  filteredData: any[] = [];
  form: FormGroup;

  data = [
    {
      row_id: 1,
      email: 'Chatchai.ka@ku.th',
      teacher_code: 'REGXXXXXXX',
      prefix: 'ดร',
      firstname: 'ฉัตรชัย',
      lastname: 'เกษมทวีโชค',
      role: '2',
      active_status: '1',
    },
    {
      row_id: 2,
      email: 'Rawee.si@ku.th',
      teacher_code: '6430250318',
      prefix: 'นาย',
      firstname: 'รวี',
      lastname: 'สินบำรุง',
      role: '1',
      active_status: '1',
    },
    {
      row_id: 3,
      email: 'Minnie.si@ku.th',
      teacher_code: 'REGXXXXXXX',
      prefix: 'นางสาว',
      firstname: 'มินนี่',
      lastname: 'สินทรัพย์',
      role: '2',
      active_status: '2',
    },
    {
      row_id: 4,
      email: 'Kamon.pon@ku.th',
      teacher_code: 'REGXXXXXXX',
      prefix: 'นางสาว',
      firstname: 'กมลพร',
      lastname: 'พรหม',
      role: '1',
      active_status: '1',
    },
    {
      row_id: 5,
      email: 'salee.da@ku.th',
      teacher_code: 'REGXXXXXXX',
      prefix: 'นางสาว',
      firstname: 'สาลี',
      lastname: 'ดาวเดือน',
      role: '1',
      active_status: '1',
    },
    {
      row_id: 6,
      email: 'krangkai.m@ku.th',
      teacher_code: 'REGXXXXXXX',
      prefix: 'นาย',
      firstname: 'เกรียงไกร',
      lastname: 'มุขมรกต',
      role: '1',
      active_status: '1',
    },
  ];

  roleOption = [{ id: '1', title: 'ผู้ดูแลระบบ' }, { id: '2', title: 'อาจารย์' }];
  statusOption = [{ id: '1', title: 'active' }, { id: '2', title: 'inactive' }];

  constructor(private searchService: SearchService, private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      teacher_code: ['', Validators.required],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      active_status: ['', Validators.required]
    });
  }

  onAddUserClick(){
    this.router.navigate(['UserManagement/AddUser'])
  }

  // รับข้อมูลจาก searchService
  ngOnInit() {
    this.filteredData = this.filterData({}); // กำหนดค่าเริ่มต้นเป็นค่าว่างเพื่อแสดงข้อมูลทั้งหมด

    this.searchService.currentSearchCriteria.subscribe(criteria => {
      this.searchCriteria = criteria;
      if (this.searchCriteria) {
        this.filteredData = this.filterData(this.searchCriteria); // ฟิลเตอร์ข้อมูลตาม criteria
      }
    });
  }

  toggleUploadExcel(): void {
    this.isUploadExcelVisible = !this.isUploadExcelVisible; // Toggle การแสดงผล
  }

  handleFileUpload(data: any): void {
    console.log('Data uploaded:', data);
    this.filteredData = [...this.filteredData, ...data];
    this.isUploadExcelVisible = false;
  }

  // ฟังก์ชันการฟิลเตอร์ข้อมูลตาม criteria
  filterData(criteria: any): any[] {
    return this.data.filter(item => {
      const searchString = criteria.fullname || '';  // ใช้ fullname ในการค้นหา
  
      return (
        (!criteria.teacher_code || item.teacher_code.includes(criteria.teacher_code)) &&
        (!criteria.email || item.email.includes(criteria.email)) &&
        (!criteria.role || item.role === criteria.role) &&
        (!criteria.active_status || item.active_status === criteria.active_status) &&
        // ค้นหาจาก fullname โดยใช้ฟังก์ชัน matchAnyField
        (!searchString || this.matchAnyField(searchString, item)) 
      );
    });
  }

    // ฟังก์ชันในการค้นหาข้อมูลในทุกๆ ฟิลด์
    matchAnyField(searchString: string, item: any): boolean {
      const lowerCaseSearchString = searchString.toLowerCase();
    
      // ค้นหาคำใน prefix, firstname, lastname
      return (
        item.prefix.toLowerCase().includes(lowerCaseSearchString) || 
        item.firstname.toLowerCase().includes(lowerCaseSearchString) || 
        item.lastname.toLowerCase().includes(lowerCaseSearchString)
      );
    }


  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  getRoleTitle(roleId: string): string {
    const role = this.roleOption.find(role => role.id === roleId);
    return role ? role.title : '';
  }

  getStatusTitle(statusId: string): string {
    const status = this.statusOption.find(status => status.id === statusId);
    return status ? status.title : '';
  }

  // เปิด Modal
  openModal(row: any) {
    this.selectedRowData = { ...row }; 
    this.isModalVisible = true;
    if (this.modalInstance) {
      this.modalInstance.show(); 
    }
  }

  // ปิด Modal
  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.isModalVisible = false; 
  }

  // Handle modal close event
  handleModalClose() {
    this.closeModal();
  }

  // Handle modal submit event
  handleModalSubmit(updatedData: any) {
    console.log('Submitted Data:', updatedData);
    const index = this.data.findIndex(item => item.row_id === updatedData.row_id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...updatedData }; // Update the data array
    }
    this.closeModal();
  }

  // ngAfterViewInit for Modal initialization
  ngAfterViewInit() {
    this.modalElement = document.querySelector('.modal');
    this.modalInstance = new Modal(this.modalElement);
  }
}