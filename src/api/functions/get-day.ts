export const getDay = () => {
  const date = new Date();
  const day = date.getDay();
  if (day === 0 || day === 6) {
    return 200;
  }
  return 100;
};
