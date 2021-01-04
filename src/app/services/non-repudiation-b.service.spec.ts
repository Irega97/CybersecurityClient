import { TestBed } from '@angular/core/testing';

import { NonRepudiationBService } from './non-repudiation-b.service';

describe('NonRepudiationBService', () => {
  let service: NonRepudiationBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NonRepudiationBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
