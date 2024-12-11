import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { passwordStrengthValidator } from '../validators/password-strength.validator';

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
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      teacher_code: [{value: null , disabled: this.isDisabled}, Validators.required],
      email: [{value: null, disabled: this.isDisabled}, [Validators.required, Validators.email]],
      role: [null, Validators.required],
      prefix: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      password: [null, [Validators.required, passwordStrengthValidator(),
        // Validators.pattern(/^[a-zA-Z]+$/)
      ]],
      // confirm_password: [null, [Validators.required, passwordStrengthValidator()]],
      // confirm_password: [{value:null, disabled: this.isDisabled}, Validators.required],
      active_status: [null, Validators.required],
    });

  

  this.form.get('password')?.valueChanges.subscribe((password) =>{
    if (password && password.trim() !== '') {
      this.addConditionalFields();
    } else{
      this.removeConditionalFields();
      // this.form.clearValidators();
    }
    // this.form.updateValueAndValidity();
  });
}


private matchPasswords: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirm_password')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};

// get passwordControl() {
//   return this.form.get('password');
// }

private addConditionalFields() {
  if (!this.form.contains('confirm_password')) {
    // this.form.addControl(
    //   'confirm_password',
    //   this.fb.control(null, Validators.required)
    this.form.addControl('confirm_password', this.fb.control(null, Validators.required));
    this.form.setValidators(this.matchPasswords);
  }
}

private removeConditionalFields() {
  if (this.form.contains('confirm_password')) {
    this.form.removeControl('confirm_password');
    this.form.clearValidators();
  }
}

  onHide() {
    // if(confirm('ต้องการปิดหน้าต่างหรือไม่?')){
    this.hide.emit();
    this.form.reset();
    this.removeConditionalFields();
  // }
}

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      console.log("Form is valid Data submitted: ", this.form.getRawValue());
      this.submit.emit(this.form.value);
    } else {
      console.log("Form is invalid. Errors: ", this.form.errors);
      this.form.markAllAsTouched();
    }
  }
  
  @HostListener('document:keydown.escape', ['$event'])
  onEscapePress(event: KeyboardEvent) {
    if (this.show) {
      this.onHide();
    }
  }
}