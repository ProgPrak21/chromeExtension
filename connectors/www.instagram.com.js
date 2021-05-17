async function openUrl(tabToUpdate, url) {
    await chrome.tabs.update(tabToUpdate.id, { url });
    return new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info, tab) {
            if (tabId === tabToUpdate.id && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(onUpdated);
                resolve(tab);
            }
        });
    });
}

function submitForm() {
    document.getElementById('igCoreRadioButtonoutputFormatJSON').checked = true;
    document.querySelector('form > div > button').click();
    console.log('Hi from content script');
}

async function dispatchDataRequest (tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: submitForm,
    });
}

async function verifyLoggedInStatus(tab) {

    // Try to open our request page wich requires us be logged into instagram
    const requestUrl = 'https://www.instagram.com/download/request/';
    tab = await openUrl(tab, requestUrl);
    // Check if we get redirected to login page
    if (tab.url !== requestUrl) {
        return false;
    }
    return true;
}

export async function run(tab) {

    let descriptionDiv = document.getElementById("description");
    if (await verifyLoggedInStatus(tab)){
        await dispatchDataRequest(tab);
        descriptionDiv.innerHTML = "Please approve the data request.";
        // TODO Send message to background that there is possibly request pending.
        chrome.runtime.sendMessage(tab.id,'request-incoming');
    } else {
        // Explain that we first need the user to login
        descriptionDiv.innerHTML = "We first need you to be logged into the service, please click me again afterwards.";
    }
}

export async function isRequestSendToUrl(url) {
    // Now we must defer the page to the user, so that they can enter their
    // password. We then listen for a succesfull AJAX call 
    return new Promise((resolve) => {
        chrome.webRequest.onCompleted.addListener(
            (details) => {
                if (details.statusCode === 200) {
                    console.log('Successfully dispatched!')
                    syncDataRequestToStorage();
                    resolve(true);
                    }
                }),
            {urls: [ url ]}
    });
}