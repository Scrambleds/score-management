import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { SearchService } from '../../services/search-service/seach.service'
import { Router } from '@angular/router';
import { UserManageService } from '../../services/user-manage/user-manage.service';
import { HttpResponseBase } from '@angular/common/http';

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
  originalData: any[] = [];
  filteredData: any[] = [];
  form: FormGroup;

  roleOption = [{ id: 'ผู้ดูแลระบบ', title: 'ผู้ดูแลระบบ' }, { id: 'อาจารย์', title: 'อาจารย์' }];
  statusOption = [{ id: 'active', title: 'active' }, { id: 'inactive', title: 'inactive' }];

  constructor(private UserManageService: UserManageService,
    private searchService: SearchService, 
    private fb: FormBuilder, 
    private router: Router) 
    {
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
    // เรียก API เพื่อดึงข้อมูลจาก server
    this.UserManageService.getUsers().subscribe({
      next: (response: any) => {
        if (response.isSuccess) {
          this.originalData = response.objectResponse;
          this.filteredData = [...this.originalData];
          // this.filteredData = this.filterData(response.objectResponse, {});
          console.log("MY DATA",this.filteredData);
        } else {
          console.error('Failed to fetch data', response.message);
        }
      },
      error: err => {
        console.error('API Error:', err);
      }
    });

    this.searchService.currentSearchCriteria.subscribe(criteria => {
      this.searchCriteria = criteria;
      if (this.searchCriteria) {
        this.filteredData = this.filterData(this.originalData, this.searchCriteria);  // ฟิลเตอร์ข้อมูลตาม criteria
      }
    });
  }

    // ฟังก์ชันการฟิลเตอร์ข้อมูลตาม criteria
  filterData(data: any[], criteria: any): any[] {
    return data.filter(item => {
      const searchString = criteria.fullname?.toLowerCase() || '';
      return (
        (!criteria.teacher_code || item.teacher_code?.includes(criteria.teacher_code)) &&
        (!criteria.email || item.email?.includes(criteria.email)) &&
        (!criteria.role || item.role === criteria.role) &&
        (!criteria.active_status || item.active_status === criteria.active_status) &&
        (!searchString || this.matchAnyField(searchString, item)) // เปลี่ยนการค้นหาตาม fullname ทั้งหมด
      );
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

    // ฟังก์ชันในการค้นหาข้อมูลในทุกๆ ฟิลด์
    matchAnyField(searchString: string, item: any): boolean {
      const lowerCaseSearchString = searchString.toLowerCase();
    
      // รวม prefix, firstname, lastname และทำการค้นหาคำในทุกฟิลด์
      const fullName = `${item.prefix} ${item.firstname} ${item.lastname}`.toLowerCase();
      return fullName.includes(lowerCaseSearchString);
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
    // console.log('Role:', role);
    return role ? role.title : '';
  }
  

  getStatusTitle(statusId: string): string {
    const status = this.statusOption.find(status => status.id === statusId); // Cast statusId to a number
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
    const index = this.filteredData.findIndex(item => item.row_id === updatedData.row_id);
    if (index !== -1) {
      this.filteredData[index] = { ...this.filteredData[index], ...updatedData }; // Update the data array
    }
    this.closeModal();
  }

  // ngAfterViewInit for Modal initialization
  ngAfterViewInit() {
    this.modalElement = document.querySelector('.modal');
    this.modalInstance = new Modal(this.modalElement);
  }
}