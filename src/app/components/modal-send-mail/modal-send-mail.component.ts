import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ScoreAnnouncementService } from '../../services/score-announcement/score-announcement.service';

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

  placeholderList: any[] = [];
  privateTemplateList: any[] = [];
  defaultTemplateList: any[] = [];
  allTemplateList: any[] = [];

  constructor(
    private http: HttpClient,
    private scoreAnnouncementService: ScoreAnnouncementService
  ) {}

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

  loadDefaultTemplate(templateKey: string): void {
    let template = this.defaultTemplateList.find(
      (t) => t.templateName === templateKey
    );
    console.log(template);
    if (template) {
      // แทนที่ค่าใน subject
      this.emailSubject = template.detail.subject;

      // แทนที่ค่าใน body
      this.messageText = template.detail.body;
    }
  }
  loadPrivateTemplate(templateKey: string): void {
    let template = this.privateTemplateList.find(
      (t) => t.templateName === templateKey
    );
    if (template) {
      // แทนที่ค่าใน subject
      this.emailSubject = template.detail.subject;

      // แทนที่ค่าใน body
      this.messageText = template.detail.body;
    }
  }
  setDefaultTemplate(templateKey: string): void {
    console.log(`setDefault template : ${templateKey}`);
  }
  createTemplate() {}
  updateTemplate(templateKey: string) {
    console.log(`update Template : ${templateKey}`);
  }
  deleteTemplate(templateKey: string) {
    console.log(`deleteTemplate : ${templateKey}`);
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
}
