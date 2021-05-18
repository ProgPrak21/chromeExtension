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

async function getBytesInUseSync(key) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.getBytesInUse(key, function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}


async function isRequestSend(url) {
    // Now we must defer the page to the user, so that they can enter their
    // password. We then listen for a succesfull AJAX call 
    return new Promise((resolve) => {
        chrome.webRequest.onCompleted.addListener((details) => {
                if (details.statusCode === 200) {
                    console.log('Successfully dispatched!')
                    resolve(true);
                    }
                },
            {urls: [ url ]}
        )
    });
}

function syncDataRequestToStorage(hostname) {
    let date = +new (Date)
    chrome.storage.sync.set({ [hostname]: date }, function () {
        console.log('Synced ' + hostname + ' : ' + date + ' to browser storage.');
    });
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    // todo
    console.log('Received message.url: ' + message.url);
    console.log('Storage bytes in use: ' + await getBytesInUseSync(null));
    if (message.url) {
        if (await isRequestSend(message.url)) {
            const { hostname } = new URL(message.url);
            syncDataRequestToStorage(hostname);
            console.log('Current storage bytes in use: ' + await getBytesInUseSync(null));
        }
    }
});

async function isDataRequestComplete(request) {
    // todo
    console.log("Checking whether request "+ JSON.stringify(request, null, 4) +" is complete")
    if (true) {
        console.log("Data request is complete")
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
    console.log("Fetched storage entries: " + JSON.stringify(requests, null, 4))
    
    // check if any requests can be fullfilled
    for (request in requests) {
        if (await isDataRequestComplete(request)) {
            // download data and delete browser storage entry 
            await downloadData();
            chrome.storage.sync.remove(request);
            console.log("Removed storage entry: "+ JSON.stringify(request, null, 4))
        }
        // todo: if a request is older than the max time specified for that vendor we should delete it too.
    }
    
    requests = await getAllStorageSyncData();
    if (Object.keys(requests).length === 0 && requests.constructor === Object) {
        // if no requests are in storage delete alarm
        chrome.alarms.clearAll();
        console.log("Cleared alarms")
    }
        // console.log('Current storage bytes in use: ' + await getBytesInUseSync(null));
    // if no other requests are in storage delete alarm
    /*
    if (await getBytesInUseSync(null) === 0) {
        chrome.alarms.clearAll();
        console.log("Cleared alarms")
    }
    */
});



// Set alarm if storage changes and we have at least one storage entry
chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area === 'sync' && chrome.storage.sync.getBytesInUse(null) != 0) {
        // check whether we don't have any objects in storage
        requests = await getAllStorageSyncData();
        if (!(Object.keys(requests).length === 0 && requests.constructor === Object)) {
            chrome.alarms.create('refresh', { delayInMinutes: 0.1, periodInMinutes: 1 });
            console.log("Set alarm")
        }
    }
});