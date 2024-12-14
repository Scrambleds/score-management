import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { SearchService } from '../search-service/seach.service';

@Component({
  selector: 'app-form-edit',
  standalone: false,
  templateUrl: './form-edit.component.html',
  styleUrls: ['./form-edit.component.css']
})
export class FormEditComponent implements OnInit {

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
      // fullname: 'ดร ฉัตรชัย เกษมทวีโชค',
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
      // fullname: 'นาย รวี สินบำรุง',
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
      // fullname: 'นางสาว มินนี่ สินทรัพย์',
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
      fullname: 'นางสาว กมลพร พรหม',
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
      // fullname: 'นางสาว สาลี ดาวเดือน',
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
      // fullname: 'นาย เกรียงไกร มุขมรกต',
      prefix: 'นาย',
      firstname: 'เกรียงไกร',
      lastname: 'มุขมรกต',
      role: '1',
      active_status: '1',
    },
  ];

  roleOption = [{ id: '1', title: 'ผู้ดูแลระบบ' }, { id: '2', title: 'อาจารย์' }];
  statusOption = [{ id: '1', title: 'active' }, { id: '2', title: 'inactive' }];

  constructor(private searchService: SearchService, private fb: FormBuilder) {
    // Initialize form in constructor
    this.form = this.fb.group({
      teacher_code: ['', Validators.required],
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      active_status: ['', Validators.required]
    });
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

  // ฟิลเตอร์ข้อมูลตาม criteria
  filterData(criteria: any): any[] {
    return this.data.filter(item => {
      return (
        (!criteria.teacher_code || item.teacher_code.includes(criteria.teacher_code)) &&
        // (!criteria.fullname || item.fullname.includes(criteria.fullname)) &&
        (!criteria.prefix || item.prefix.includes(criteria.prefix)) &&
        (!criteria.firstname || item.firstname.includes(criteria.firstname)) &&
        (!criteria.lastname || item.lastname.includes(criteria.lastname)) &&
        (!criteria.email || item.email.includes(criteria.email)) &&
        (!criteria.role || item.role === criteria.role) &&
        (!criteria.active_status || item.active_status === criteria.active_status)
      );
    });
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