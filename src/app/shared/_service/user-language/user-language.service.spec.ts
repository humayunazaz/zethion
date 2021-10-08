import { TestBed } from '@angular/core/testing';

import { UserLanguageService } from './user-language.service';

describe('UserLanguageService', () => {
  let service: UserLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
