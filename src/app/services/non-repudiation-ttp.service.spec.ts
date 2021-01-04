import { TestBed } from '@angular/core/testing';

import { NonRepudiationTTPService } from './non-repudiation-ttp.service';

describe('NonRepudiationTTPService', () => {
  let service: NonRepudiationTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonRepudiationTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
