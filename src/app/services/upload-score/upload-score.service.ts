import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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

  private apiUrl = 'https://example.com/api/subjects'; // Replace with your API endpoint

  constructor(private http: HttpClient) {}

  /**
   * Search subjects by term.
   * @param term The search term entered by the user.
   * @returns Observable of filtered subjects.
   */
  searchSubjects(
    term: string
  ): Observable<{ subjectCode: string; subjectName: string }[]> {
    if (!term.trim()) {
      // If the search term is empty, return an empty array.
      return of([]);
    }

    // Uncomment the following code if using backend API:
    /*
    return this.http
      .get<{ subjectCode: string; subjectName: string }[]>(`${this.apiUrl}?search=${term}`)
      .pipe(map((data) => data || []));
    */

    // Using mock data for demo purposes:
    const filteredSubjects = this.mockSubjects.filter(
      (subject) =>
        subject.subjectCode.toLowerCase().includes(term.toLowerCase()) ||
        subject.subjectName.toLowerCase().includes(term.toLowerCase())
    );
    return of(filteredSubjects);
  }
}
