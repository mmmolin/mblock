// Checks if a given URL is blocked

console.log('mblock content script loaded');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'PING') {
    sendResponse({ pong: true });
  }
});

function matchesBlockedAddress(url: string, blockedUrl: string): boolean {
  return url.startsWith(blockedUrl);
}

function isBlockingActive(startTime: string, endTime: string): boolean {
    const [startHour, startMinutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinutes, 0, 0);

    const [endHour, endMinutes] = endTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(endHour, endMinutes, 0, 0);
    
    const nowDate = new Date();

    return nowDate >= startDate && nowDate <= endDate;
}

function checkAndBlock() {
  try {
    chrome.storage.local.get({ addresses: [], startTime: '', endTime: '' }, (res) => {
      const addresses: string[] = res.addresses as string[] || [] as string[];
      const startTime: string = res.startTime as string;
      const endTime: string = res.endTime as string;

      if (isBlockingActive(startTime, endTime)) {
        for (const address of addresses) {
          try {
            if (matchesBlockedAddress(location.href, address)) {
              const html = `<!doctype html><html><head><meta charset="utf-8"><title>Blocked</title><style>body{display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:Arial,sans-serif}h1{font-size:24px;color:#222}</style></head><body><h1>page blocked</h1></body></html>`;
              document.open();
              document.write(html);
              document.close();
              return;
            }
          } catch (e) {
          }
        }
      }
    });
  } catch (e) {
  }
}

checkAndBlock();

if (chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.addresses || changes.startTime || changes.endTime) checkAndBlock();
  });
}
