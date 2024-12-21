import { Component, EventEmitter, HostListener, Input, Output,  AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { passwordStrengthValidator } from '../validators/password-strength.validator';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { UserEditService } from '../../services/edit-user/edit-user.service'
import { response } from 'express';

@Component({
  selector: 'app-modal-edit',
  standalone: false,
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent {
  @Input() show = false; // ควบคุมการแสดงผลของ modal
  @Input() roleOptions: Array<{ id: string; title: string }> = [];
  @Input() statusOptions: Array<{ id: string; title: string }> = [];
  @Input() selectedRowData: any; 

  @Output() hide = new EventEmitter<void>(); // สัญญาณเมื่อปิด modal
  @Output() submit = new EventEmitter<any>(); // ส่งข้อมูล form กลับไปที่ parent เมื่อ submit

  form: FormGroup;
  @ViewChild('modalElement') modalElement: ElementRef | undefined;
  modalInstance: Modal | undefined;
  isDisabled = true; 
  submitted = false;
  

  constructor(private fb: FormBuilder, private userEditService: UserEditService) {
    this.form = this.fb.group({
      row_id: [null],
      teacher_code: [{value: null , disabled: this.isDisabled}, Validators.required],
      email: [{value: null, disabled: this.isDisabled}, [Validators.required, Validators.email]],
      role: [null, Validators.required],
      prefix: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      password: [null, [passwordStrengthValidator()]],
      active_status: [null, Validators.required],
    });

    this.form.get('password')?.valueChanges.subscribe((password) => {
      if (password && password.trim() !== '') {
        this.addConditionalFields();
      } else {
        this.removeConditionalFields();
      }
    });
  }

  // ฟังก์ชันตรวจสอบการตรงกันของ password และ confirm_password
  private matchPasswords: ValidatorFn = (control: AbstractControl) => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirm_password')?.value;

    if (!password || password.length < 8){
      return null;
    }
  
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true }; // ส่งข้อผิดพลาดเมื่อรหัสผ่านไม่ตรงกัน
    }
    return null; // ไม่มีข้อผิดพลาด
  };

  ngAfterViewInit() {
    if (this.modalElement) {
      this.modalInstance = new Modal(this.modalElement.nativeElement);
    }
  }

  openModal(row: any) {
    this.selectedRowData = { ...row };
    if (this.modalInstance) {
      this.modalInstance.show();
    }
    this.form.patchValue({
      row_id: this.selectedRowData.row_id,
      teacher_code: this.selectedRowData.teacher_code,
      email: this.selectedRowData.email,
      role: this.selectedRowData.role,
      prefix: this.selectedRowData.prefix,
      firstname: this.selectedRowData.firstname,
      lastname: this.selectedRowData.lastname,
      active_status: this.selectedRowData.active_status,
    });
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
    this.hide.emit(); 
    this.form.reset(); 
    this.removeConditionalFields(); 
  }

  ngOnChanges() {
    if (this.show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    if (this.selectedRowData) {
      this.form.patchValue({
        row_id: this.selectedRowData.row_id,
        teacher_code: this.selectedRowData.teacher_code,
        email: this.selectedRowData.email,
        role: this.selectedRowData.role,
        prefix: this.selectedRowData.prefix,
        firstname: this.selectedRowData.firstname,
        lastname: this.selectedRowData.lastname,
        active_status: this.selectedRowData.active_status,
      });
    }
  }

  ngOnDestroy(){
    this.unlockScroll();
  }

  lockScroll() {
    document.body.classList.add('modal-open');
    document.body.style.overflow = 'hidden';
  }

  unlockScroll() {
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onHide();
    }
  }

  onModalDialogClick(event: Event) {
    event.stopPropagation(); // ป้องกันการปิด modal เมื่อคลิกใน modal
  }

  ngOnInit() {
    if(this.show){
      this.lockScroll();
    }

    // ฟังการเปลี่ยนแปลงของ password
    this.form.get('password')?.valueChanges.subscribe(() => {
      this.form.get('confirm_password')?.updateValueAndValidity();
    });
  
    // ฟังการเปลี่ยนแปลงของ confirm_password
    this.form.get('confirm_password')?.valueChanges.subscribe(() => {
      this.form.get('confirm_password')?.updateValueAndValidity();
    });
  }

  private addConditionalFields() {
    if (!this.form.contains('confirm_password')) {
      this.form.addControl('confirm_password', this.fb.control(null, Validators.required));
    }
    this.form.get('confirm_password')?.setValidators([Validators.required, this.matchPasswords]);
    this.form.get('confirm_password')?.updateValueAndValidity(); 
    this.form.updateValueAndValidity(); 
  }

  private removeConditionalFields() {
    if (this.form.contains('confirm_password')) {
      this.form.removeControl('confirm_password');
    }
  }

  onShowModal() {
    this.show = true;
  }

  onHide() {
    this.show = false;
    this.hide.emit();
    this.unlockScroll();

    setTimeout(() => {
    this.form.reset();
    this.removeConditionalFields();
  }, 800);
  }

  onSubmit() {
    this.submitted = true;
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  
    if (this.form.valid && ((!this.form.value.password && !this.form.value.confirm_password) || (this.form.value.password === this.form.value.confirm_password))) {
      
      const update_by = localStorage.getItem('username') || 'admin';
      const userData = this.form.getRawValue();
      userData.update_by = update_by;
      console.log("ฟอร์มถูกต้อง ข้อมูลที่ส่ง: ", userData);
      this.userEditService.editUser(userData).subscribe((response: any) => {
        console.log("Response from API:", response);
        this.submit.emit(this.form.getRawValue()); 
  
        Swal.fire({
          title: 'สำเร็จ',
          text: 'บันทึกข้อมูลเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#007bff'
        }).then(() => {
          // เมื่อกด "ตกลง" ใน Swal, ปิด modal
          if (this.modalInstance) {
            this.modalInstance.hide();
          }
        });
  
        this.form.reset();
        this.removeConditionalFields();
        
      }, (error: any) => {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'การอัปเดตข้อมูลผู้ใช้ล้มเหลว',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#ff0000',
        });
        this.form.reset();
        this.removeConditionalFields();
      });
    } else {
      console.log("ฟอร์มไม่ถูกต้อง ข้อผิดพลาด: ", this.form.errors);
    }
  }
  
  onBlurConfirmPassword() {
    const confirmPasswordControl = this.form.get('confirm_password');
    confirmPasswordControl?.updateValueAndValidity(); 
    confirmPasswordControl?.markAsTouched(); 
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    if (this.show) {
      this.onHide();
    }
  }
}
