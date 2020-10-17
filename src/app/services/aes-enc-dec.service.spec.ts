import { TestBed } from '@angular/core/testing';

import { AESEncDecService } from './aes-enc-dec.service';

describe('AESEncDecService', () => {
  let service: AESEncDecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AESEncDecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
