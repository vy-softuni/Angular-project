import { DateAgoPipe } from '@project/src/app/shared/pipes/date-ago.pipe';

function minutesAgo(m: number) {
  const d = new Date(Date.now() - m * 60_000);
  return d.toISOString();
}

describe('DateAgoPipe', () => {
  it('says just now for <1 minute', () => {
    const pipe = new DateAgoPipe();
    expect(pipe.transform(new Date())).toBe('just now');
  });
  it('formats minutes', () => {
    const pipe = new DateAgoPipe();
    expect(pipe.transform(minutesAgo(5))).toBe('5m ago');
  });
  it('formats hours', () => {
    const pipe = new DateAgoPipe();
    expect(pipe.transform(minutesAgo(120))).toBe('2h ago');
  });
  it('formats days', () => {
    const pipe = new DateAgoPipe();
    expect(pipe.transform(minutesAgo(24 * 60))).toBe('1d ago');
  });
});