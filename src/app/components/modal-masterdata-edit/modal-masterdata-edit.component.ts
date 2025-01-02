import { Component, EventEmitter, HostListener, Input, Output,  AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { passwordStrengthValidator } from '../validators/password-strength.validator';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { UserEditService } from '../../services/edit-user/edit-user.service'
import { SelectBoxService } from '../../services/select-box/select-box.service';
import { UserService } from '../../services/sharedService/userService/userService.service'
import { UserManageService } from '../../services/user-manage/user-manage.service';
import { Router } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-modal-masterdata-edit',
  standalone: false,
  
  templateUrl: './modal-masterdata-edit.component.html',
  styleUrl: './modal-masterdata-edit.component.css'
})
export class ModalMasterdataEditComponent implements AfterViewInit {
  @ViewChild('modalElement') modalElement: ElementRef | undefined;
  @Output() showChange = new EventEmitter<boolean>();
  modalInstance: Modal | undefined;
  @Input() show = false;

  ngAfterViewInit() {
    // สร้าง instance ของ modal
    this.modalInstance = new Modal(this.modalElement?.nativeElement);

    // เปิด modal ถ้า show เป็น true
    if (this.show) {
      this.modalInstance.show();
    }
  }

  @HostListener('hidden.bs.modal')
  onModalHidden() {
    this.showChange.emit(false); // แจ้ง parent ว่า modal ถูกปิดแล้ว
  }

  ngOnChanges() {
    // เปิดหรือปิด modal ตามค่า show
    if (this.show) {
      this.modalInstance?.show();
    } else {
      this.modalInstance?.hide();
    }
  }

  closeModal() {
    this.show = false;
    this.modalInstance?.hide();
    this.showChange.emit(false); // แจ้ง parent component
  }
}