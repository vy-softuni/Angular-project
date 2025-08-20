import { TruncatePipe } from '@project/src/app/shared/pipes/truncate.pipe';

describe('TruncatePipe', () => {
  it('returns empty string for falsy input', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('')).toBe('');
  });

  it('does not truncate when below limit', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('hello', 10)).toBe('hello');
  });

  it('truncates and appends ellipsis', () => {
    const pipe = new TruncatePipe();
    const input = 'a'.repeat(10);
    expect(pipe.transform(input, 5)).toBe('aaaaa...');
  });
});