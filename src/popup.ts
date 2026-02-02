document.addEventListener('DOMContentLoaded', () => {
  const blockBtn = document.getElementById('block-btn') as HTMLButtonElement | null;
  const urlInput = document.getElementById('url-input') as HTMLInputElement | null;
  const addressList = document.getElementById('address-list') as HTMLUListElement | null;
  const noAddresses = document.getElementById('no-addresses') as HTMLElement | null;

  const startTime = document.getElementById('start-time') as HTMLInputElement | null;
  const endTime = document.getElementById('end-time') as HTMLInputElement | null; 


  // Functions
  function saveStartTime(value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ startTime: value }, () => {
        if (chrome.runtime.lastError) {
          console.error('saveStartTime error', chrome.runtime.lastError);
          return reject(chrome.runtime.lastError);
        }
        console.log('saveStartTime saved', value);
        resolve();
      });
    });
  }

  function saveEndTime(value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ endTime: value }, () => {
        if (chrome.runtime.lastError) {
          console.error('saveEndTime error', chrome.runtime.lastError);
          return reject(chrome.runtime.lastError);
        }
        console.log('saveEndTime saved', value);
        resolve();
      });
    });
  }

  function loadStartTime(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ startTime: '' }, (result: { startTime?: string }) => {
        if (chrome.runtime.lastError) {
          console.error('loadStartTime error', chrome.runtime.lastError);
          return reject(chrome.runtime.lastError);
        }
        const v = result.startTime ?? '';
        console.log('loadStartTime loaded', v);
        resolve(v);
      });
    });
  }

  function loadEndTime(): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get({ endTime: '' }, (result: { endTime?: string }) => {
        if (chrome.runtime.lastError) {
          console.error('loadEndTime error', chrome.runtime.lastError);
          return reject(chrome.runtime.lastError);
        }
        const v = result.endTime ?? '';
        console.log('loadEndTime loaded', v);
        resolve(v);
      });
    });
  }

  function loadAddresses(): Promise<string[]> {
    return new Promise((resolve) => {
      chrome.storage.local.get({ addresses: [] }, (result: {addresses?: string[]}) => {
        resolve(result.addresses || []);
      });
    });
  }

  function saveAddresses(addresses: string[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set({ addresses }, () => resolve());
    });
  }

  function render(addresses: string[]) {
    if (!addressList || !noAddresses) return;
    addressList.innerHTML = '';
    if (!addresses.length) {
      noAddresses.style.display = 'block';
      return;
    }
    noAddresses.style.display = 'none';

    addresses.forEach((addr, idx) => {
      const li = document.createElement('li');
      li.className = 'address-item';

      const span = document.createElement('span');
      span.className = 'address-text';
      span.textContent = addr;

      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.dataset.index = String(idx);

      li.appendChild(span);
      li.appendChild(removeBtn);
      addressList.appendChild(li);
    });
  }

  // Loaders
  loadAddresses().then(render);
  
  loadStartTime().then((val) => {
    if (startTime) startTime.value = val
  });

  loadEndTime().then((val) => {
    if (endTime) endTime.value = val;
  }).catch((e) => console.error('loadEndTime failed', e));


  // Event listeners
  blockBtn?.addEventListener('click', async () => {
    const pattern = urlInput?.value.trim();
    if (!pattern) return;

    const addresses = await loadAddresses();
    addresses.push(pattern);
    await saveAddresses(addresses);
    render(addresses);
    if (urlInput) urlInput.value = '';

    chrome.runtime.sendMessage({ type: 'ADD_BLOCK_RULE', pattern }, (resp) => {
    });
  });

  addressList?.addEventListener('click', async (ev) => {
    const target = ev.target as HTMLElement;
    if (target && target.classList.contains('remove-btn')) {
      const idx = Number(target.dataset.index);
      const addresses = await loadAddresses();
      if (Number.isInteger(idx) && idx >= 0 && idx < addresses.length) {
        const removed = addresses.splice(idx, 1)[0];
        await saveAddresses(addresses);
        render(addresses);
        chrome.runtime.sendMessage({ type: 'REMOVE_BLOCK_RULE', pattern: removed }, () => {});
      }
    }
  });

  startTime?.addEventListener('change', async () => {
      await saveStartTime(startTime.value ?? '');
  });

  endTime?.addEventListener('change', async () => {
    const v = endTime?.value ?? '';
    console.log('endTime change', v);
    try {
      await saveEndTime(v);
    } catch (e) {
      console.error('failed to save end time', e);
    }
  });
});
