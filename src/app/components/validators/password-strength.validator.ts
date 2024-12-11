import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    
    // ตรวจสอบว่ามีตัวอักษรภาษาอังกฤษและตัวเลข หรืออักขระพิเศษ
    const hasEnglishAndSpecialCharacters = /^[a-zA-Z0-9]+$/.test(value);
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const hasMinLength = value.length >= 8;

    const errors: any = {};

    // ตรวจสอบว่าแต่ละเงื่อนไขครบถ้วนหรือไม่
    // if (!hasUpperCase) {
    //   errors.missingUpperCase = 'ต้องมีตัวอักษรพิมพ์ใหญ่';
    // }
    // if (!hasLowerCase) {
    //   errors.missingLowerCase = 'ต้องมีตัวอักษรพิมพ์เล็ก';
    // }
    // if (!hasSpecialCharacter) {
    //   errors.missingSpecialCharacter = 'ต้องมีอักขระพิเศษ';
    // }
    if (!hasMinLength) {
      errors.minLength = 'ต้องมีอย่างน้อย 8 ตัวอักษร';
    }
    if (!hasEnglishAndSpecialCharacters) {
      errors.hasEnglishAndSpecialCharacters = "กรุณากรอกภาษาอังกฤษและตัวเลขเท่านั้น";
    }

    // คืนค่าข้อผิดพลาดหรือ null ถ้าผ่านทุกเงื่อนไข
    return Object.keys(errors).length ? errors : null;
  };
}