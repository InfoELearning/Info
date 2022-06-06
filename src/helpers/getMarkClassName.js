// eslint-disable-next-line import/prefer-default-export
export const getMarkClassName = (value) => {
  const mark = Math.round(value.mark);
  if (mark === 5) return 'light-green';
  if (mark === 4) return 'green';
  if (mark === 3) return 'orange';
  if (mark === 2) return 'red';
  if (!mark && value.withMark && new Date(value.dateEnd) < new Date() && !value.date) return 'pass';
  return '';
};
