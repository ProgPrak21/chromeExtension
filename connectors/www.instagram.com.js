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
    // check if we get redirected to loginpage
    
    // Close tab when done
    chrome.tabs.remove(tab);
}



export async function run() {
    await verifyLoggedInStatus();
    
    // Fetch the data from the instagram API
    
      
}
