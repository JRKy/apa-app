export const formatDate = (date, format = 'MMMM D, YYYY') => {
  if (!date || isNaN(new Date(date))) {
    return 'Invalid Date';
  }

  const d = new Date(date);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  if (format === 'MM/DD/YYYY') {
    return `${String(month + 1).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;
  }

  return `${months[month]} ${day}, ${year}`;
}; 