import { TestBed } from '@angular/core/testing';

import { CredentialsService } from './credentials-logs.service';

describe('CredentialsService', () => {
  let service: CredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
