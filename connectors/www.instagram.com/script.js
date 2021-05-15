import scrapingUrls from './urls.js';

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

async function verifyLoggedInStatus() {
    const profileUrl = 'https://www.instagram.com/accounts/access_tool/ads_interests';
    
    let tab = await openUrlInNewTab(profileUrl, false);
    // TODO: check if we get redirected to login page, if so, wait for user input.
    
    // Close tab when done
    chrome.tabs.remove(tab.id);
}

async function fetchJsonFromAPI() {
    
    // Now we do all API requests in order to retrieve the data
    const responses = await Promise.all(
        scrapingUrls.map(url => 
            fetch(url).then(response => response.json())
        )
    );

    // We then transform the data so that we can return it to the handler
    return responses.map(response => {
        return {
            filepath: `${response.page_name}.json`,
            data: JSON.stringify(response.data.data, null, 4),
        };
    });
}


export async function run() {
    await verifyLoggedInStatus();
    
    // Fetch the data from the instagram API
    let responses = await fetchJsonFromAPI();
    
    // TODO Where should those jsons go?
      
}
