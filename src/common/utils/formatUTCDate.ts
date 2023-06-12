export const formatUTCDate = (date: Date) => {
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear().toString().slice(2);
  return `${month}/${day}/${year}`;
};
