import { SafeHTMLStylePipe } from './safe-html-style.pipe';

describe('SafeHTMLStylePipe', () => {
  it('create an instance', () => {
    const pipe = new SafeHTMLStylePipe();
    expect(pipe).toBeTruthy();
  });
});
