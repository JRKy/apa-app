import { formatDate } from '../formatDate';

describe('formatDate utility', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-01-01T12:00:00');
    expect(formatDate(date)).toBe('January 1, 2023');
  });

  it('should handle invalid date input', () => {
    expect(formatDate('invalid')).toBe('Invalid Date');
  });

  it('should format date with custom format', () => {
    const date = new Date('2023-01-01T12:00:00');
    expect(formatDate(date, 'MM/DD/YYYY')).toBe('01/01/2023');
  });
}); 