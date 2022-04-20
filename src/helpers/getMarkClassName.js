// eslint-disable-next-line import/prefer-default-export
export const getMarkClassName = (value) => {
  const mark = Math.round(value);
  if (mark === 5) return 'light-green';
  if (mark === 4) return 'green';
  if (mark === 3) return 'orange';
  if (mark === 2) return 'red';
  return '';
};
