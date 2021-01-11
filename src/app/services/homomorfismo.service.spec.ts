import { TestBed } from '@angular/core/testing';

import { HomomorfismoService } from './homomorfismo.service';

describe('HomomorfismoService', () => {
  let service: HomomorfismoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomomorfismoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
