import { TestBed } from '@angular/core/testing';

import { ScoreAnnouncementService } from './score-announcement.service';

describe('ScoreAnnouncementService', () => {
  let service: ScoreAnnouncementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreAnnouncementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
