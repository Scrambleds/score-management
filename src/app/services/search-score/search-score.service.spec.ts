import { TestBed } from '@angular/core/testing';

import { SearchScoreService } from './search-score.service';

describe('SearchScoreService', () => {
  let service: SearchScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
