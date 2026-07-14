export function toLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function addDaysToLocalDate(days, date = new Date()) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return toLocalDateString(result);
}

export function formatLocalDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}
