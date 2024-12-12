import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UploadScoreService {
  private mockSubjects = [
    {
      subjectCode: '01418442-60',
      subjectName: 'Web Technology and Web Services',
    },
    { subjectCode: '01418499-65', subjectName: 'Computer Science Project' },
    {
      subjectCode: '01418221-60',
      subjectName: 'Fundamentals of Database Systems',
    },
    {
      subjectCode: '01418222-60',
      subjectName: 'Internet Application for Commerce',
    },
    {
      subjectCode: '01418233-60',
      subjectName: 'Assembly Language and Computer Architecture',
    },
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
