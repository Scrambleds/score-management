import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchCriteriaSource = new BehaviorSubject<any>(null);
  currentSearchCriteria = this.searchCriteriaSource.asObservable();

  // Method สำหรับอัพเดตข้อมูล search criteria
  updateSearchCriteria(criteria: any) {
    this.searchCriteriaSource.next(criteria);
  }
}
