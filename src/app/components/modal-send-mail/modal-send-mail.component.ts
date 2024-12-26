import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ScoreAnnouncementService } from '../../services/score-announcement/score-announcement.service';
import { UserService } from '../../services/sharedService/userService/userService.service';
import bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-send-mail',
  standalone: false,

  templateUrl: './modal-send-mail.component.html',
  styleUrl: './modal-send-mail.component.css',
})
export class ModalSendMailComponent implements OnInit {
  messageText: string = ''; // ข้อความใน textarea
  emailSubject: string = ''; // ข้อความใน input subject
  selectedVariable: any = null; // ตัวแปรที่เลือกจาก select กำหนดเป็น null เพื่อแสดง placeholder
  canAddVariable: boolean = false; // ควบคุมการ enabled ปุ่ม
  focusedField: 'textarea' | 'subject' | null = null; // ฟิลด์ที่กำลัง focus อยู่
  language: string = 'th'; // ค่าภาษาเริ่มต้น
  templateName: string = '';

  placeholderList: any[] = [];
  privateTemplateList: any[] = [];
  defaultTemplateList: any[] = [];
  allTemplateList: any[] = [];

  //flg
  isCreateTemplateSubmited = false;
  isSendMailSubmited = false;

  //form
  public createTemplateForm: FormGroup;

  constructor(
    private http: HttpClient,
    private scoreAnnouncementService: ScoreAnnouncementService,
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder
  ) {
    this.createTemplateForm = this.fb.group({
      nameTemplate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // ดึงค่า language จาก localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.language = savedLanguage; // กำหนดภาษาจาก localStorage
    }
    this.loadEmailPlaceholder();
    this.loadEmailTemplate();
  }

  //load MasterData
  loadEmailPlaceholder(): void {
    this.scoreAnnouncementService.loadEmailPlaceholder().subscribe((resp) => {
      console.log(resp);
      this.placeholderList = resp;
    });
  }
  loadEmailTemplate(): void {
    this.scoreAnnouncementService
      .loadEmailTemplate('pamornpon')
      .subscribe((resp: any) => {
        this.defaultTemplateList = resp.defaultTemplates;
        this.privateTemplateList = resp.privateTemplates;
        this.allTemplateList = [
          ...this.privateTemplateList,
          ...this.defaultTemplateList,
        ];
        console.log(this.defaultTemplateList);
        console.log(this.privateTemplateList);
      });
  }

  // เมื่อ textarea ได้ focus
  onTextareaFocus(): void {
    this.canAddVariable = true;
    this.focusedField = 'textarea';
  }

  // เมื่อ input subject ได้ focus
  onSubjectFocus(): void {
    this.canAddVariable = true;
    this.focusedField = 'subject';
  }

  // เมื่อ focus หลุดจาก textarea หรือ input
  onBlur(): void {
    setTimeout(() => {
      // this.canAddVariable = false;
      // this.focusedField = null;
    }, 250);
  }

  // ฟังก์ชันเพิ่มตัวแปร
  addVariable(): void {
    if (!this.selectedVariable) return;

    if (this.focusedField === 'textarea') {
      this.insertVariableIntoTextarea();
    } else if (this.focusedField === 'subject') {
      this.insertVariableIntoSubject();
    }

    // this.selectedVariable = ''; // เคลียร์ตัวเลือก
  }

  // แทรกตัวแปรใน textarea
  private insertVariableIntoTextarea(): void {
    const textarea = document.getElementById(
      'emailMessage'
    ) as HTMLTextAreaElement;

    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const beforeCursor = this.messageText.substring(0, start);
      const afterCursor = this.messageText.substring(end);

      this.messageText = beforeCursor + this.selectedVariable + afterCursor;

      const newCursorPos = start + this.selectedVariable.length;
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    }
  }

  // แทรกตัวแปรใน input subject
  private insertVariableIntoSubject(): void {
    const input = document.getElementById('emailSubject') as HTMLInputElement;

    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;

      const beforeCursor = this.emailSubject.substring(0, start);
      const afterCursor = this.emailSubject.substring(end);

      this.emailSubject = beforeCursor + this.selectedVariable + afterCursor;

      const newCursorPos = start + this.selectedVariable.length;
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(newCursorPos, newCursorPos);
      });
    }
  }

  //template
  // เทมเพลต mockup
  templates: { [key: string]: { subject: string; body: string } } = {
    basicTemplate1: {
      subject: `ประกาศคะแนนเก็บวิชา {!SUBJECT_ID} {!SUBJECT_NAME} ปีการศึกษา {!ACADEMIC_YEAR}`,
      body: `ถึง {!STUDENT_PREFIX}{!STUDENT_NAME}\nอีเมลฉบับนี้ถูกส่งโดยระบบจัดการคะแนน\nวิชา: {!SUBJECT_NAME}\nชื่อ: {!STUDENT_PREFIX}{!STUDENT_NAME}\nรหัสนิสิต: {!STUDENT_ID}\nหมู่เรียน: {!SECTION_ID}\n\nได้คะแนนรายละเอียดดังนี้\n\tประเภทคะแนน \t\t\tคะแนน\n\tคะแนนเก็บ    \t\t\t{!ACCUMULATED_SCORE}\n\tคะแนนกลางภาค\t\t\t{!MIDTERM_SCORE}\n\tคะแนนปลายภาค\t\t\t{!FINAL_SCORE}\n\tรวมคะแนนทั้งหมด\t\t\t{!TOTAL_SCORE}\n\nคะแนนเฉลี่ย: {!MEAN_SCORE}/100\nคะแนนสูงสุด: {!MAX_SCORE}/100\nคะแนนต่ำสุด: {!MIN_SCORE}/100\n\nหากมีคำถาม กรุณาติดต่ออาจารย์ผู้สอนโดยตรง\n\n{!TEACHER_NAME}`,
    },
  };
  loadTemplate(templateKey: string): void {
    const template = this.templates[templateKey];
    if (template) {
      // แทนที่ค่าใน subject
      this.emailSubject = template.subject;

      // แทนที่ค่าใน body
      this.messageText = template.body;
    }
  }

  loadDefaultTemplate(templateKey: number): void {
    let template = this.defaultTemplateList.find(
      (t) => t.templateId === templateKey
    );
    console.log(template);
    if (template) {
      // แทนที่ค่าใน subject
      this.emailSubject = template.detail.subject;

      // แทนที่ค่าใน body
      this.messageText = template.detail.body;
    }
  }
  loadPrivateTemplate(templateKey: number): void {
    let template = this.privateTemplateList.find(
      (t) => t.templateId === templateKey
    );
    if (template) {
      // แทนที่ค่าใน subject
      this.emailSubject = template.detail.subject;

      // แทนที่ค่าใน body
      this.messageText = template.detail.body;
    }
  }
  setDefaultTemplate(templateKey: number): void {
    console.log(`setDefault template : ${templateKey}`);
  }
  createTemplate() {
    console.log('createTemplate');
    const payload = {
      template_name: '',
      subject: this.emailSubject,
      body: this.messageText,
      username: this.userService.username, // Replace with actual username
    };
    this.scoreAnnouncementService.createEmailTemplate(payload).subscribe(
      (response) => {
        console.log('Response : ', response);
      },
      (error) => {
        console.error('Error creating template:', error);
      }
    );
    this.toggleTemplateDialog(false); // ปิด dialog หลังบันทึก
  }
  updateTemplate(templateKey: number) {
    console.log(`update Template : ${templateKey}`);
    const payload = {
      template_id: templateKey, // Assuming templateKey maps to template_id
      subject: this.emailSubject,
      body: this.messageText,
      username: this.userService.username, // Replace with actual username
    };
    this.scoreAnnouncementService.updateEmailTemplate(payload).subscribe(
      (response) => {
        console.log('Response : ', response);
      },
      (error) => {
        console.error('Error updating template:', error);
      }
    );
  }
  deleteTemplate(templateKey: number) {
    console.log(`deleteTemplate : ${templateKey}`);
    const payload = {
      template_id: templateKey, // Assuming templateKey maps to template_id
      username: this.userService.username, // Replace with actual username
    };
    this.scoreAnnouncementService.deleteEmailTemplate(payload).subscribe(
      (response) => {
        console.log('Response : ', response);
      },
      (error) => {
        console.error('Error updating template:', error);
      }
    );
  }

  //email placeholder
  // ฟังก์ชันสำหรับแสดงข้อความตามภาษา
  getDisplayText(item: any): string {
    return this.language === 'en' ? item.desc_en : item.desc_th;
  }

  insertTab(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault(); // ป้องกันการเปลี่ยน focus
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // เพิ่ม tab (หรือ whitespace) ในตำแหน่งที่ cursor อยู่
      textarea.value =
        textarea.value.substring(0, start) +
        '\t' +
        textarea.value.substring(end);

      // เลื่อน cursor ไปที่ตำแหน่งหลังจาก tab ที่เพิ่มเข้าไป
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
  }

  // Method ที่ถูกเรียกเมื่อกดปุ่ม "ส่งอีเมล"
  sendEmail() {
    const payload = {
      subjectDetail: {
        subject_id: '01418442-60',
        subject_name: 'Web service and Web api I',
        academic_year: '2024',
        semester: '1',
        section: '800',
        student_id: '6430250229',
      },
      //username teacher
      username: 'pamornpon',
      emailDetail: {
        subjectEmail: this.emailSubject,
        contentEmail: this.messageText,
      },
    };

    console.log('Email Payload:', payload); // แสดงค่าใน console

    this.http
      .post(`${environment.apiUrl}/api/StudentScore/SendStudentScore`, payload)
      .subscribe((response: any) => {
        if (response.isSuccess) {
          console.log(response);
        } else {
          console.log(response);
        }
      });
  }

  isTemplateDialogVisible = false;

  toggleTemplateDialog(visible: boolean): void {
    this.isTemplateDialogVisible = visible;
    const bodyChildren = document.body.children;
    for (const child of Array.from(bodyChildren)) {
      if (child.id !== 'createTemplateDialog' && visible) {
        this.renderer.setAttribute(child, 'aria-hidden', 'true');
      } else if (child.id !== 'createTemplateDialog' && !visible) {
        this.renderer.removeAttribute(child, 'aria-hidden');
      }
    }

    // Focus first element in the dialog when opened
    if (visible) {
      //set delay for avoid DOM can't build it in time
      setTimeout(() => {
        const dialog = this.el.nativeElement.querySelector(
          '#createTemplateDialog'
        );
        if (dialog) {
          const focusableElements = dialog.querySelectorAll(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          );
          //move focus to first element in dialog
          (focusableElements[0] as HTMLElement)?.focus();
        }
      });
    }
  }

  // Prevent tab focus outside modal dialog create template
  trapFocus(event: KeyboardEvent): void {
    const dialog = this.el.nativeElement.querySelector('#createTemplateDialog');
    const focusableElements = dialog.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Shift + Tab: Move focus to the last element if on the first element
        if (document.activeElement === firstElement) {
          event.preventDefault();
          (lastElement as HTMLElement).focus();
        }
      } else {
        // Tab: Move focus to the first element if on the last element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          (firstElement as HTMLElement).focus();
        }
      }
    }
  }

  onSave(): void {
    // Logic บันทึกข้อมูล
    if (this.isCreateTemplateSubmited) {
      return;
    }
    this.isCreateTemplateSubmited = true;
    if (this.createTemplateForm.valid) {
      const formData = this.createTemplateForm.value;
      console.log(formData);
      console.log('submit name template is: ', formData.nameTemplate);
      const payload = {
        template_name: formData.nameTemplate,
        subject: this.emailSubject,
        body: this.messageText,
        username: this.userService.username,
      };
      this.scoreAnnouncementService.createEmailTemplate(payload).subscribe(
        (response) => {
          this.createTemplateForm.reset();
          this.isTemplateDialogVisible = false;
          console.log('Success', response);
          if (response.isSuccess) {
            Swal.fire({
              title: 'บันทึกข้อมูลสำเร็จ',
              icon: 'success',
              confirmButtonColor: 'var(--primary-color)',
              confirmButtonText: 'ตกลง',
            }).then((result) => {
              if (result.isConfirmed) {
                // หากคลิก "ตกลง"
                console.log('success : ', response.messageDesc);
              }
            });
          } else {
            Swal.fire({
              title: 'เกิดข้อผิดพลาด',
              text: response.message.messageDescription,
              icon: 'error',
              confirmButtonColor: 'var(--secondary-color)',
              confirmButtonText: 'ปิด',
            }).then((result) => {
              if (result.isConfirmed) {
                // หากคลิก "ตกลง"
                console.log('error : ', response.messageDesc);
              }
            });
          }
        },
        (error) => {
          console.log('Error', error);
        },
        () => {
          this.isCreateTemplateSubmited = false; // reset flg
        }
      );
      // this.createTemplateForm.reset();
      // this.isTemplateDialogVisible = false;
    } else {
      console.log('กรุณากรอกข้อมูลให้ครบถ้วน');
    }
  }

  onCancel(): void {
    this.isTemplateDialogVisible = false;
    // Logic ยกเลิกการทำงาน
    this.createTemplateForm.reset();
    // // this.isTemplateDialogVisible = false;
    // const delay = 300; // ระยะเวลา animation ใน ms
    // setTimeout(() => {
    //   this.createTemplateForm.reset();
    // }, delay);
  }
}
