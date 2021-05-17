function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}

async function isRequestSend(url) {
    // Now we must defer the page to the user, so that they can enter their
    // password. We then listen for a succesfull AJAX call 
    return new Promise((resolve) => {
        chrome.webRequest.onCompleted.addListener((details) => {
                if (details.statusCode === 200) {
                    console.log('Successfully dispatched!')
                    syncDataRequestToStorage();
                    resolve(true);
                    }
                },
            {urls: [ url ]}
        )
    });
}

function syncDataRequestToStorage(hostname) {
    let date = +new (Date)
    chrome.storage.sync.set({ hostname: date }, function () {
        console.log('Synced ' + hostname + ' : ' + date + ' to browser storage.');
    });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // todo
    console.log('Received: ' + message);
    
    // Fixme: console.log('Storage: ' + await chrome.storage.sync.getBytesInUse());
    if (message.url) {
        if (await isRequestSend(message.url)) {
            const { hostname } = new URL(message.url);
            syncDataRequestToStorage(hostname);
        }
    }
});

async function isDataRequestComplete(request) {
    // todo
    if (true) {
        console.log("(Data Request is complete")
        return true;
    } else {
        return false;
    }
}

async function downloadData() {
    // todo
    console.log("Downloaded Data")
}

chrome.alarms.onAlarm.addListener(async () => {
    requests = await getAllStorageSyncData();
    console.log("Fetched storage entries: " + requests)

    // check if any requests can be fullfilled
    for (request in requests) {
        if (await isDataRequestComplete(request)) {
            // download data and delete browser storage entry 
            await downloadData();
            chrome.storage.sync.remove(request[0]);
            console.log("Removed storage entry")
        }
        // todo: if a request is older than the max time specified for that vendor we should delete it too.
    }

    // if no other requests are in storage delete alarm
    if (chrome.storage.getBytesInUse(null) == 0) {
        chrome.alarms.clearAll();
        console.log("Cleared alarm")
    }
});



// Set alarm if storage changes and we have at least one storage entry
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && chrome.storage.sync.getBytesInUse(null) != 0) {

        chrome.alarms.create('refresh', { delayInMinutes: 0.1, periodInMinutes: 1 });
        console.log("Set alarm")
    }
});