import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import moment from 'moment';
import { getHostname, getTodayKey } from './utils';

let today = {};
let lastTab = null;
let todayDate = getTodayKey();
const getToday = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(getTodayKey(), (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      console.log('Got from items', items);
      resolve(items[getTodayKey()]);
    });
  });
};

const interId = setInterval(() => {
  console.log('Running', todayDate, getTodayKey());
  if (todayDate !== getTodayKey()) {
    console.log('DATE CHANGED!!!!!');
    computeAndAddTabInfo(lastTab);
    todayDate = getTodayKey();
    today = {};
    console.log('new todat', today);
    getToday().then((items) => {
      Object.assign(today, items);
    });
    lastTab = {
      ...lastTab,
      start: moment(),
    };
  }
}, 20000);

getToday().then((items) => {
  Object.assign(today, items);
});

console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  console.log('Focus changed', windowId);
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    computeAndAddTabInfo(lastTab);
    console.log('All windows are hidden');
  } else {
    let queryOptions = { active: true, currentWindow: true };
    setTimeout(async () => {
      chrome.tabs.query(queryOptions, (tabs) => {
        let [tab] = tabs;
        console.log('After window active', tab);
        lastTab = {
          ...tab,
          start: moment(),
        };
      });
    }, 1000);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  console.log(lastTab.url, changeInfo.url);
  if (!lastTab.url || !changeInfo.url) return;
  const currHostname = getHostname(lastTab.url);
  const newHostname = getHostname(changeInfo.url);
  chrome.tabs.get(tabId, (tab) => {
    if (tabId === lastTab.id && currHostname !== newHostname) {
      computeAndAddTabInfo(lastTab);
      lastTab = {
        ...tab,
        start: moment(),
      };
    }
  });
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  setTimeout(async () => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      computeAndAddTabInfo(lastTab);
      lastTab = {
        ...tab,
        start: moment(),
      };
    });
  }, 1000);
});

const computeAndAddTabInfo = (tab) => {
  if (!tab) return;
  console.log(tab, today);
  const hostName = getHostname(tab.url);
  const current = today[hostName];
  let time = 0;
  if (current) {
    time = current.time;
  }
  const secondsElapsed = moment().diff(tab.start, 'seconds');
  const favIcon = tab.favIconUrl;

  const tabEntry = {
    time: time + secondsElapsed,
    favIcon: favIcon || current?.favIcon,
  };
  today[hostName] = tabEntry;
  const storage = {};
  storage[todayDate] = today;
  chrome.storage.sync.set(storage);
};

chrome.runtime.onInstalled.addListener((info) => {
  if (info.reason === 'install') {
    chrome.storage.sync.set({
      sites: [
        {
          enabled: false,
        },
      ],
    });
  }
});
