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

await chrome.notifications.create('', {
    type: 'basic',
    title: 'Instagram Authentication required',
    message: 'We first need you to log into Instagram',
    iconUrl: '/images/logo32.png'
});


let descriptionDiv = document.getElementById("description");
descriptionDiv.innerHTML = "We first need you to log in.";
alert('We first need you to log in');

chrome.notifications.create('', {
    title: 'Instagram Authentication required',
    message: 'We first need you to log into Instagram',
    iconUrl: '',
    type: 'basic'
});

async function waitForUserInput(tabToWatch) {
    return new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function _(tabId, info, tab) {
            if (tabToWatch.id === tabId && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(_);
                resolve();
            }
        });
    });
}

async function waitForChangeToUrl(tabToWatch, url) {
    return new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function _(tabId, info, tab) {
            if (tabToWatch.id === tabId && info.status === "complete" && tab.url === url) {
                chrome.tabs.onUpdated.removeListener(_);
                resolve();
            }
        });
    });
}