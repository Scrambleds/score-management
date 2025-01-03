import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-edit',
  standalone: false,
  templateUrl: './form-edit.component.html',
  styleUrl: './form-edit.component.css'
})
export class FormEditComponent {
  form: FormGroup;
  data = [
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
    {
      citizenId: 'REGXXXXXXX',
      prospectFullName: 'ดร.ฉัตรชัย เกษมทวีโชค',
      corpStatus: 'Chatchai.ka@ku.th',
      saleType: 'อาจารย์',
      createDate: 'active',
      prospectId: 1,
    },
  ];

  masterdata = {
    accounttype: [
      { id: '1', title: 'Individual' },
      { id: '2', title: 'Corporate' },
    ],
    saleType: [
      { id: '1', title: 'Retail' },
      { id: '2', title: 'Wholesale' },
    ],
  };

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      citizenId: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
      corpStatus: [null, Validators.required],
      saleTypeCode: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }

  handleClickBtnDeleteData(value: any): void {
    console.log('Delete clicked for:', value);
    // Add delete handling logic here
  }
}