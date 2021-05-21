import { TestBed } from '@angular/core/testing';

import { ApiIssueService } from './api-issue.service';

describe('ApiIssueService', () => {
  let service: ApiIssueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiIssueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
