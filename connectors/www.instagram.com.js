function goToUrl(tab, url) {
    chrome.tabs.update(tab.id, { url });
    return new Promise((resolve) => {
      chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
        if (tabId === tab.id && info.status === "complete") {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          resolve();
        }
      });
    });
  }

function submitForm () {
    document.getElementById('igCoreRadioButtonoutputFormatJSON').checked = true;
    document.querySelector('form > div > button').click();
}

function executeScript (tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: submitForm,
      });
}

async function verifyLoggedInStatus() {
    const profileUrl = 'https://www.instagram.com/accounts/access_tool/ads_interests';
    window.loadURL(profileUrl);
}


export async function run(tab) {
    await verifyLoggedInStatus();
    await goToUrl(tab, 'https://www.instagram.com/download/request/')
    executeScript(tab);
    
}
