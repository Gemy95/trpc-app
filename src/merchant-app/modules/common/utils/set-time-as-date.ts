export const setDateTime = (str, date = new Date()) => {
  const sp = str.split(':');
  date.setHours(parseInt(sp[0], 10));
  date.setMinutes(parseInt(sp[1], 10));
  date.setSeconds(parseInt(sp[2], 10));
  return date;
};
