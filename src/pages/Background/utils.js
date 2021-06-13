import moment from 'moment';
export const getHostname = (url) => {
  const urlObj = new URL(url);
  return urlObj.hostname;
};

export const getTodayKey = () => moment().format('MMMM Do YYYY');
