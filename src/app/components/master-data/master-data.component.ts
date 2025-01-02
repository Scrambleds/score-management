// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-master-data',
//   standalone: false,
  
//   templateUrl: './master-data.component.html',
//   styleUrl: './master-data.component.css'
// })
// export class MasterDataComponents {
//   majors = [
//     {
//       id: 1,
//       descriptionThai: 'วิทยาการคอมพิวเตอร์',
//       descriptionEng: 'Computer Science',
//       createdDate: '2025-03-28',
//       status: 'active',
//     },
//     {
//       id: 2,
//       descriptionThai: 'เทคโนโลยีสารสนเทศ',
//       descriptionEng: 'Information Technology',
//       createdDate: '2025-03-28',
//       status: 'active',
//     },
//   ];

//   editMajor(id: number) {
//     console.log('Edit major with id:', id);
//     // Implement editing logic here
//   }
// }

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
  isModalVisible = false;

  data = {
    dataOpportunity: [
      {
        productGroup: 'Product Group 1',
        opportunityDetail: [
          {
            opportunityName: 'Opportunity 1',
            stage: 'Closed Won',
            closeDate: '2025-01-01',
            staffname: 'John Doe',
            teamStatus: 'TEAM',
            opportunityId: '1'
          }
        ]
      },
      {
        productGroup: 'Product Group 2',
        opportunityDetail: []
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

  onShowChange(show: boolean) {
    this.showModal = show;
  }

  onSubmit(): void {
    const values = this.form.value;
    console.log('Form Submitted', values);
  }

  openModal() {
    this.showModal = true; // อัปเดตสถานะ
  }
  
  closeModal() {
    this.showModal = false; // อัปเดตสถานะ
  }
  
    ngAfterViewInit() {
      this.modalElement = document.querySelector('.modal');
      this.modalInstance = new Modal(this.modalElement);
    }
}