import { Modal } from 'bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// import { FormSelectComponent } from './form-select.component';
// import { FormOpportunityComponent } from './form-opportunity.component';
import { ModalMasterdataEditComponent } from '../../components/modal-masterdata-edit/modal-masterdata-edit.component'

@Component({
  selector: 'app-master-data',
  standalone: false,
  
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.css'
})
export class MasterDataComponents implements OnInit {
  form!: FormGroup;
  selectedDetail: any;
  @Input() options: any[] = [];
  openCollapse: number | null = null;
  // showOpportunityModal = false;
  modalElement: any;
  modalInstance: any;
  showModal = false;
  showAddModal = false;
  showEditModal = false;
  isModalVisible = false;

  data = {
    masterData: [
      {
        byte_reference: 'major_code',
        byteDetail: [
          {
            byte_code: '1',
            byte_desc_th: 'วิทยาการคอมพิวเตอร์',
            byte_desc_en: 'Computer science',
            create_date: '2025-01-01',
            active_satus: 'active',
          },
          {
            byte_code: '2',
            byte_desc_th: 'สาขาฟิสิกส์',
            byte_desc_en: 'Physics',
            create_date: '2025-01-02',
            active_satus: 'active',
          }
        ]
      },
      {
        byte_reference: 'role',
        byteDetail: [
          {
            byte_code: '1',
            byte_desc_th: 'ผู้ดูแลระบบ',
            byte_desc_en: 'Admin',
            create_date: '2025-01-02',
            active_satus: 'active',
          },
          {
            byte_code: '2',
            byte_desc_th: 'อาจารย์',
            byte_desc_en: 'Teacher',
            create_date: '2025-01-02',
            active_satus: 'active',
          },
        ]
      }
    ]
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      productGroup: [''],
      stage: ['']
    });
  }

  toggleCollapse(index: number): void {
    this.openCollapse = this.openCollapse === index ? null : index;
  }

  // onShowChange(show: boolean) {
  //   this.showModal = show;
  // }

  onSubmit(): void {
    const values = this.form.value;
    console.log('Form Submitted', values);
  }

  onAddModalChange = (show: boolean) => {
    this.showAddModal = show;
  }

  onEditModalChange = (show: boolean) => {
    this.showEditModal = show;
  }

  openAddModal = () => {
    this.showAddModal = true;
  }

  openEditModal = () => {
    this.showEditModal = true;
  }

  closeEditModal = () => {
    this.showEditModal = false;
  }

  closeAddModal = () => {
    this.showAddModal = false;
  }

  // openModal() {
  //   this.showModal = true; 
  // }
  
  // closeModal() {
  //   this.showModal = false; 
  // }
  
    ngAfterViewInit() {
      this.modalElement = document.querySelector('.modal');
      this.modalInstance = new Modal(this.modalElement);
    }
}