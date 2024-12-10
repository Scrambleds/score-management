import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-edit',
  standalone: false,
  templateUrl: './modal-edit.component.html',
  styleUrl: './modal-edit.component.css'
})
export class ModalEditComponent {
  @Input() show = false; // Control visibility
  @Input() role: Array<{ id: string; title: string }> = []; 
  @Input() active_status: Array<{ id: string; title: string }> = [];

  @Output() hide = new EventEmitter<void>(); // Emit event to parent on hide
  @Output() submit = new EventEmitter<any>(); // Emit form data to parent on submit

  form: FormGroup;
  isDisabled = true;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      teacher_code: [{value: null , disabled: this.isDisabled}, Validators.required],
      email: [{value: null, disabled: this.isDisabled}, Validators.required],
      role: [null, Validators.required],
      prefix: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      password: [null, Validators.required],
      // confirm_password: [{value:null, disabled: this.isDisabled}, Validators.required],
      active_status: [null, Validators.required],
    });


  this.form.get('password')?.valueChanges.subscribe((password) =>{
    if (password && password.trim() !== '') {
      this.addConditionalFields();
    } else{
      this.removeConditionalFields();
    }
  });
}

private addConditionalFields() {
  if (!this.form.contains('confirm_password')) {
    this.form.addControl(
      'confirm_password',
      this.fb.control(null, Validators.required)
    );
  }
}

private removeConditionalFields() {
  if (this.form.contains('confirm_password')) {
    this.form.removeControl('confirm_password');
  }
}

  onHide() {
    this.hide.emit();
    this.form.reset();
    this.removeConditionalFields();
  }

  onSubmit() {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}