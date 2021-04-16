import { TestBed } from '@angular/core/testing';

import { ClientcredentialsService } from './clientcredentials.service';

describe('ClientcredentialsService', () => {
  let service: ClientcredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientcredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
