import { TestBed } from '@angular/core/testing';

import { UploadScoreService } from './upload-score.service';

describe('UploadScoreService', () => {
  let service: UploadScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadScoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
