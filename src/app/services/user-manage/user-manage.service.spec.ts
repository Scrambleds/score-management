import { TestBed } from '@angular/core/testing';

import { UserManageService } from './user-manage.service';

describe('UserManageService', () => {
  let service: UserManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
