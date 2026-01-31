console.log('mblock background service worker');

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.type === 'ADD_BLOCK_RULE') {
    const rule: any = {
      id: msg.id || Date.now(),
      priority: 1,
      action: { type: 'block' },
      condition: { urlFilter: msg.pattern || msg.url, resourceTypes: ['main_frame'] }
    };

    if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.updateDynamicRules) {
      chrome.declarativeNetRequest.updateDynamicRules({ addRules: [rule], removeRuleIds: [] }, () => {
        sendResponse({ success: true });
      });
      return true; // keep port open for async sendResponse
    } else {
      sendResponse({ success: false, error: 'declarativeNetRequest API not available' });
    }
  }

  if (msg?.type === 'REMOVE_BLOCK_RULE') {
    if (chrome.declarativeNetRequest && chrome.declarativeNetRequest.getDynamicRules && chrome.declarativeNetRequest.updateDynamicRules) {
      chrome.declarativeNetRequest.getDynamicRules((rules: any[]) => {
        const idsToRemove = (rules || []).filter(r => r?.condition?.urlFilter === msg.pattern).map(r => r.id);
        if (idsToRemove.length) {
          chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: idsToRemove, addRules: [] }, () => {
            sendResponse({ success: true, removed: idsToRemove });
          });
        } else {
          sendResponse({ success: true, removed: [] });
        }
      });
      return true;
    } else {
      sendResponse({ success: false, error: 'declarativeNetRequest API not available' });
    }
  }
});
