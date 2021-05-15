async function openUrlInNewTab(url, active) {
    let createdTab = await chrome.tabs.create({ url, active });
    return new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function _(tabId, info, tab) {
            // make sure the status is 'complete' and it's the right tab
            if (createdTab.id === tabId && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(_);
                resolve(tab);
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


export async function run() {
    let tab = await openUrlInNewTab('https://www.instagram.com/download/request/', true);
    executeScript(tab);
    // Wait for the Userinput 
    
    // Close tab when done
    chrome.tabs.remove(tab);   
}
