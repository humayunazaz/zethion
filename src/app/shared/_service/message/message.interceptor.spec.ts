import { TestBed } from '@angular/core/testing';

import { MessageInterceptor } from './message.interceptor';

describe('MessageInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      MessageInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: MessageInterceptor = TestBed.inject(MessageInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
