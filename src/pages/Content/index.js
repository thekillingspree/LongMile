const blur_list = ['outlook.live.com'];

chrome.extension.sendMessage({}, async function (response) {
  const host = window.location.host;
  const sites = await getSites();
  const blurringEnabled = sites[0].enabled;
  if (!blurringEnabled) {
    console.log('Blurring disabled.');
    return;
  }
  const siteShouldBeBlurred = sites.filter((site) => {
    console.log(site.host === host, site);
    return site.host === host || `www.${site.host}` === host;
  })[0]?.enabled;
  console.log('site should be', siteShouldBeBlurred, sites);
  if (!siteShouldBeBlurred) return;
  document.querySelector('html').style.filter = 'blur(20px)';
  var readyStateCheckInterval = setInterval(function () {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      setTimeout(() => {
        document.querySelector('html').style.filter = 'blur(0px)';
      }, 2000);
      console.log('Blurring contents');

      const allElements = document.querySelectorAll('*:not(html)');
      allElements.forEach((elem) => {
        elem.style.filter = 'blur(2px)';
        elem.addEventListener('mouseover', () => {
          elem.style.filter = 'none';
        });
        elem.addEventListener('mouseout', () => {
          elem.style.filter = 'blur(2px)';
        });
      });
    }
  }, 10);
});

const getSites = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('sites', (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(items['sites']);
    });
  });
};
