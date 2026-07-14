import { addDaysToLocalDate, formatLocalDate, toLocalDateString } from '../utils/date';

describe('date utils', () => {
  test('conserva la fecha del calendario local', () => {
    const localDate = new Date(2026, 6, 14, 23, 30);

    expect(toLocalDateString(localDate)).toBe('2026-07-14');
  });

  test('suma dias respetando cambios de mes', () => {
    const endOfMonth = new Date(2026, 6, 31, 12, 0);

    expect(addDaysToLocalDate(1, endOfMonth)).toBe('2026-08-01');
  });

  test('formatea una fecha para mostrarla', () => {
    expect(formatLocalDate('2026-07-14')).toBe('14/07/2026');
  });
});
