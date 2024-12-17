import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-send-mail',
  standalone: false,

  templateUrl: './modal-send-mail.component.html',
  styleUrl: './modal-send-mail.component.css',
})
export class ModalSendMailComponent {
  messageText: string = ''; // ข้อความใน textarea
  emailSubject: string = ''; // ข้อความใน input subject
  selectedVariable: string = ''; // ตัวแปรที่เลือกจาก select
  canAddVariable: boolean = false; // ควบคุมการ enabled ปุ่ม
  focusedField: 'textarea' | 'subject' | null = null; // ฟิลด์ที่กำลัง focus อยู่

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
      subject: `ประกาศคะแนนเก็บวิชา {!SUBJECT_ID} {!SUBJECT_NAME} ปีการศึกษา {!SUBJECT_ACAD_YEAR}`,
      body: `ถึง {!STUDENT_PREFIX}{!STUDENT_NAME}

อีเมลฉบับนี้ถูกส่งโดยระบบจัดการคะแนน
วิชา: {!SUBJECT_NAME}
ชื่อ: {!STUDENT_PREFIX}{!STUDENT_NAME}
รหัสนิสิต: {!STUDENT_ID}
หมู่เรียน: {!SECTION_ID}

ได้คะแนนรายละเอียดดังนี้
	ประเภทคะแนน											คะแนน
	คะแนนเก็บ											{!ACCUMULATED_SCORE}
	คะแนนกลางภาค										{!MIDTERM_SCORE}
	คะแนนปลายภาค										{!FINAL_SCORE}
	รวมคะแนนทั้งหมด										{!TOTAL_SCORE}

คะแนนเฉลี่ย: {!MEAN_SCORE}/100
คะแนนสูงสุด: {!MAX_SCORE}/100
คะแนนต่ำสุด: {!MIN_SCORE}/100

หากมีคำถาม กรุณาติดต่ออาจารย์ผู้สอนโดยตรง

{!TEACHER_NAME}`,
    },
  };

  // ฟังก์ชันเลือกเทมเพลต
  // loadTemplate(templateKey: string): void {
  //   const template = this.templates[templateKey];
  //   if (template) {
  //     this.messageText = template;
  //   }
  // }
  loadTemplate(templateKey: string): void {
    const template = this.templates[templateKey];
    if (template) {
      // แทนที่ค่าใน subject
      this.emailSubject = template.subject;

      // แทนที่ค่าใน body
      this.messageText = template.body;
    }
  }
}
