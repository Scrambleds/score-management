import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ScoreAnnouncementService } from '../../services/score-announcement/score-announcement.service';
import { UserService } from '../../services/sharedService/userService/userService.service';
import bootstrap from 'bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BehaviorSubject, switchMap } from 'rxjs';
import { CacheService } from '../../core/services/cache.service';

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
  basicTemplateList: any[] = [];
  allTemplateList: any[] = [];
  defaultTemplate: any = null;

  //BehivorSubject
  private refreshTemplates$ = new BehaviorSubject<void>(undefined);

  //flg
  isCreateTemplateSubmited: boolean = false;
  isSendMailSubmited: boolean = false;
  isSendPerPerson: boolean = false;

  //form
  public createTemplateForm: FormGroup;

  //interface
  constructor(
    private http: HttpClient,
    private scoreAnnouncementService: ScoreAnnouncementService,
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private fb: FormBuilder,
    private cacheService: CacheService
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
    // this.loadEmailTemplate();
    this.refreshTemplates$
      .pipe(
        switchMap(() =>
          this.scoreAnnouncementService.loadEmailTemplate(
            this.userService.username
          )
        )
      )
      .subscribe((resp: any) => {
        this.basicTemplateList = resp.basicTemplates;
        this.privateTemplateList = resp.privateTemplates;
        this.allTemplateList = [
          ...this.privateTemplateList,
          ...this.basicTemplateList,
        ];
        this.initDefaultTemplate(resp.defaultTemplates);
      });
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
        this.basicTemplateList = resp.basicTemplates;
        this.privateTemplateList = resp.privateTemplates;
        this.allTemplateList = [
          ...this.privateTemplateList,
          ...this.basicTemplateList,
        ];
        let defaultTemplate = resp.defaultTemplates;
        console.log(this.basicTemplateList);
        console.log(this.privateTemplateList);
        console.log(defaultTemplate);

        // เรียก initBasicTemplate หลังจากโหลดข้อมูลเสร็จ
        this.initDefaultTemplate(defaultTemplate);
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

  // เรียกใช้งานเพื่อ refresh template
  refreshTemplates(): void {
    this.refreshTemplates$.next();
  }

  initDefaultTemplate(defaultTemplate: any): void {
    console.log(defaultTemplate);
    console.log(this.allTemplateList);

    if (defaultTemplate?.defaultTemplate_id != null) {
      let templateKey: number = defaultTemplate.defaultTemplate_id;
      let template = this.allTemplateList.find(
        (t) => t.templateId === templateKey
      );
      console.log(template);
      if (template) {
        // แทนที่ค่าใน subject
        this.emailSubject = template.detail.subject;

        // แทนที่ค่าใน body
        this.messageText = template.detail.body;
      }
    } else {
      console.log('not found default template');
    }
  }

  loadBasicTemplate(templateKey: number): void {
    let template = this.basicTemplateList.find(
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
    const payload = {
      template_id: templateKey,
      username: this.userService.username, // Replace with actual username
    };
    this.scoreAnnouncementService.setDefaultTemplate(payload).subscribe(
      (response) => {
        if (response.isSuccess) {
          Swal.fire({
            title: 'บันทึกเทมเพลตพื้นฐานสำเร็จ',
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
        console.error('Error creating template:', error);
      }
    );
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
    let template = this.privateTemplateList.find(
      (t) => t.templateId === templateKey
    );
    Swal.fire({
      title: `ต้องการเขียนทับเทมเพลต ${template.templateName} ใช่หรือไม่`,
      text: 'หลังจากเขียนทับแล้วจะไม่สามารถกลับมาแก้ไขได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--primary-color)',
      confirmButtonText: 'ตกลง',
      cancelButtonColor: 'var(--secondary-color)',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        // หากคลิก "ตกลง"
        console.log('ข้อมูลถูกลบแล้ว');
        this.scoreAnnouncementService.updateEmailTemplate(payload).subscribe(
          (response) => {
            if (response.isSuccess) {
              this.cacheService.clearCacheForUrl(
                '/api/MasterData/EmailTemplate'
              );
              this.refreshTemplates();
              console.log('Response : ', response);
            } else {
              console.log('fail Response : ', response);
            }
          },
          (error) => {
            console.error('Error updating template:', error);
          }
        );
      } else if (result.isDismissed) {
        // หากคลิก "ยกเลิก"
        console.log('การบันทึกถูกยกเลิก');
      }
    });
  }
  deleteTemplate(templateKey: number) {
    console.log(`deleteTemplate : ${templateKey}`);
    const payload = {
      template_id: templateKey, // Assuming templateKey maps to template_id
      username: this.userService.username, // Replace with actual username
    };
    let template = this.privateTemplateList.find(
      (t) => t.templateId === templateKey
    );
    Swal.fire({
      title: `ต้องการลบเทมเพลต ${template.templateName} ใช่หรือไม่`,
      text: 'หลังจากลบข้อมูลแล้วจะไม่สามารถกลับมาแก้ไขได้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger-color)',
      confirmButtonText: 'ลบ',
      cancelButtonColor: 'var(--secondary-color)',
      cancelButtonText: 'ยกเลิก',
    }).then((result) => {
      if (result.isConfirmed) {
        // หากคลิก "ตกลง"
        console.log('ข้อมูลถูกลบแล้ว');
        this.scoreAnnouncementService.deleteEmailTemplate(payload).subscribe(
          (response) => {
            if (response.isSuccess) {
              this.cacheService.clearCacheForUrl(
                '/api/MasterData/EmailTemplate'
              );
              this.refreshTemplates();
              console.log('Response : ', response);
            } else {
              console.log('fail Response : ', response);
            }
          },
          (error) => {
            console.error('Error updating template:', error);
          }
        );
      } else if (result.isDismissed) {
        // หากคลิก "ยกเลิก"
        console.log('การบันทึกถูกยกเลิก');
      }
    });
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
    this.scoreAnnouncementService.sendMail(payload).subscribe(
      (response) => {
        this.createTemplateForm.reset();
        this.isTemplateDialogVisible = false;
        console.log('Success', response);
        if (response.isSuccess) {
          Swal.fire({
            title: 'ส่งอีเมลสำเร็จ',
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
    // this.http
    //   .post(`${environment.apiUrl}/api/StudentScore/SendStudentScore`, payload)
    //   .subscribe((response: any) => {
    //     if (response.isSuccess) {
    //       console.log(response);
    //     } else {
    //       console.log(response);
    //     }
    //   });
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
                this.cacheService.clearCacheForUrl(
                  '/api/MasterData/EmailTemplate'
                );
                this.refreshTemplates();
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
