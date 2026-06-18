const blockedSites = [
  "youtube.com",
  "instagram.com",
  "facebook.com"
];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url) {
    blockedSites.forEach(site => {
      if (tab.url.includes(site)) {
        console.log(`Blocked: ${site}`);

        chrome.tabs.update(tabId, {
          url: "https://www.google.com"
        });

        chrome.notifications.create({
          type: "basic",
          iconUrl: "icons/logo.png",
          title: "FocusFlow",
          message: `${site} is blocked for productivity!`
        });
      }
    });
  }
});