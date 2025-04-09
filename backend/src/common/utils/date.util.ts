import * as dayjs from 'dayjs';

/** Get today's date in 'YYYY-MM-DD' format. */
export const getTodayDate = () => {
  return dayjs().format('YYYY-MM-DD');
};

/** Get the first day of the current month in 'YYYY-MM-DD' format. */
export const getFirstDayOfCurrentMonth = () => {
  return dayjs().startOf('month').format('YYYY-MM-DD');
};

/** Get the last day of the current month in 'YYYY-MM-DD' format. */
export const getLastDayOfCurrentMonth = () => {
  return dayjs().endOf('month').format('YYYY-MM-DD');
};
