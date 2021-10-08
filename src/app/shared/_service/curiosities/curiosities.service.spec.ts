import { TestBed } from '@angular/core/testing';

import { CuriositiesService } from './curiosities.service';

describe('CuriositiesService', () => {
  let service: CuriositiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuriositiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
