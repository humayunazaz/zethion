import { SanitizeYoutubePipe } from './sanitize-youtube.pipe';

describe('SanitizeYoutubePipe', () => {
  it('create an instance', () => {
    const pipe = new SanitizeYoutubePipe();
    expect(pipe).toBeTruthy();
  });
});
