import { getTodayKey } from '../Background/utils.js';
import moment from 'moment';

export const FORMAT = 'MMMM Do YYYY';

export const hoursDecimalFromSeconds = (seconds: number) => {
  return (seconds / 3600).toFixed(2);
};

export const readableHoursFromDecimal = (hour: number) => {
  const flooredHour = Math.floor(hour);
  const mins = hour - flooredHour;
  return flooredHour > 0
    ? `${flooredHour}h ${Math.round(mins * 60)}m`
    : `${Math.round(mins * 60)}m`;
};

const getDataFromChrome = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      console.log('Got from items', items);
      resolve(items);
    });
  });
};

const generateDaysOfWeek = (day: string) => {
  const today = moment(day, FORMAT);
  const result = new Set<string>();
  for (let day = 0; day < 7; day++) {
    const weekday = today.clone().weekday(day);
    result.add(weekday.format(FORMAT));
  }
  return result;
};

const getTotalHoursFromDay = (day: any) => {
  let total = 0;
  for (const site in day) {
    if (site === chrome.runtime.id) continue;
    const element = day[site];
    total += element.time;
  }
  return hoursDecimalFromSeconds(total);
};

const getSitesFromDay = (day: any) => {
  let sites: SiteTracked[] = [];
  for (const site in day) {
    if (site === chrome.runtime.id) continue;
    const element = day[site];
    sites.push({
      ...element,
      name: site,
    });
  }
  sites.sort((a, b) => b.time - a.time);
  return sites;
};

interface SiteTracked {
  name: string;
  favIcon: string;
  time: number;
}

export interface DataItem {
  name: string;
  day: string;
  Time: number;
  sites: SiteTracked[];
}

export const getChartData = async (startDay: string): Promise<DataItem[]> => {
  const items: any = await getDataFromChrome();
  const today = moment();
  console.log(items, 'that I got');
  const days = generateDaysOfWeek(startDay);

  let data: any = {};

  for (const day of days) {
    data[day] = {
      name: day,
      day: moment(day, FORMAT).format('dddd'),
      Time: 0,
      sites: [],
    };
  }

  for (const day in items) {
    if (days.has(day)) {
      const totalHours = getTotalHoursFromDay(items[day]);
      data[day].Time = totalHours;
      data[day].sites = getSitesFromDay(items[day]);
    }
  }
  console.log(Object.values(data));
  return Object.values(data);
};
