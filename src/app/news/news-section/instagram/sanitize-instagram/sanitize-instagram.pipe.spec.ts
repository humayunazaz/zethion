import { SanitizeInstagramPipe } from './sanitize-instagram.pipe';

describe('SanitizeInstagramPipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeInstagramPipe();
    expect(pipe).toBeTruthy();
  });
});
