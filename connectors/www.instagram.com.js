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
    executeScript(tab);
    await verifyLoggedInStatus();
}
