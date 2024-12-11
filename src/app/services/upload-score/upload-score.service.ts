import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UploadScoreService {
  private mockSubjects = [
    { subjectCode: 'CS101', subjectName: 'Computer Science Basics' },
    { subjectCode: 'CS102', subjectName: 'Advanced Computer Science' },
    { subjectCode: 'MATH101', subjectName: 'Calculus I' },
    { subjectCode: 'MATH102', subjectName: 'Calculus II' },
    { subjectCode: 'ENG101', subjectName: 'English Literature' },
  ];
  constructor(private http: HttpClient) {}
  // เรียก API เพื่อดึงข้อมูลทั้งหมด
  getSubjects(): Observable<any[]> {
    // return this.http.get<any[]>(this.apiUrl);
    return of(this.mockSubjects); // ใช้ `of` เพื่อจำลองการส่งข้อมูลจาก API
  }

  // ค้นหาข้อมูลตามคำที่พิมพ์
  searchSubjects(term: string): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}?search=${term}`);
    const filteredSubjects = this.mockSubjects.filter(
      (subject) =>
        subject.subjectCode.toLowerCase().includes(term.toLowerCase()) ||
        subject.subjectName.toLowerCase().includes(term.toLowerCase())
    );
    return of(filteredSubjects); // ส่งข้อมูลที่กรองตามคำค้นหา
  }
}
