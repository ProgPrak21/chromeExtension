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

async function isDataRequestComplete(request) {
    // todo
    if (true) {

        console.log("(tried to) Data Request is complete")
        return true;
    } else {
        return false;
    }
}

async function downloadData() {
    //todo
    console.log("(tried to) Downloaded Data")
}

chrome.alarms.onAlarm.addListener(() => {

    requests = await getAllStorageSyncData();
    // check if any requests can be fullfilled
    console.log("Fetched storage entries")
    
    for (request in requests) {
        if (await isDataRequestComplete(request)){
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

//chrome.runtime.onInstalled.addListener(() => {});

// Set alarm if storage changes and we have at least one storage entry
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && chrome.storage.getBytesInUse(null) != 0){
        
        chrome.alarms.create({ delayInMinutes: 0.1, periodInMinutes: 1 });
        console.log("Set alarm")
    }
});