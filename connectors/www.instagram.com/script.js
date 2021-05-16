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

async function waitForUserInput() {
    return new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function _(tabId, info, tab) {
            // make sure the status is 'complete' and it's the right tab
            console.log(tab);
            if (tab.url == profileUrl && info.status === "complete") {
                chrome.tabs.onUpdated.removeListener(_);
                console.log('resolved!')
                resolve();
            }
        });
    });
}

async function getAuthToken() {
    
    let redirectUri = chrome.identity.getRedirectURL();
    let clientId = chrome.runtime.id; // Probably needs updating before publishing.
    let authUrl = "https://instagram.com/oauth/authorize/?" +
        "client_id=" + clientId + "&" +
        "response_type=token&" +
        "redirect_uri=" + encodeURIComponent(redirectUri);

    chrome.identity.launchWebAuthFlow({ url: authUrl, interactive: true },
        function (responseUrl) {
            console.log(responseUrl);
            let accessToken = responseUrl.substring(responseUrl.indexOf("=") + 1);
            console.log(accessToken);
        }
    );
}

async function verifyLoggedInStatus() {

    // Try to open a (arbitrary) page wich requires us be logged into instagram
    const profileUrl = 'https://www.instagram.com/accounts/access_tool/ads_interests';
    let tab = await openUrlInNewTab(profileUrl, false);


    // Check if we get redirected to login page
    if (tab.url !== profileUrl) {
        await chrome.tabs.update(tab.id, { active: true });

        // TODO Explain via popup message that we first need the user to login
        /*
        let descriptionDiv = document.getElementById("description");
        descriptionDiv.innerHTML = "We first need you to log in.";
        alert('We first need you to log in');
        */
        chrome.notifications.create('', {
            title: 'Instagram Authentication required',
            message: 'We first need you to log into Instagram',
            iconUrl: '',
            type: 'basic'
        });

        await waitForUserInput();
        //getAuthToken();
    }
    // Close tab when done
    console.log('Done');
    // chrome.tabs.remove(tab.id);
}

async function fetchJsonFromAPI() {

    // Now we do all API requests in order to retrieve the data
    let responses = await Promise.all(
        scrapingUrls.map(url =>
            fetch(url).then(response => response.json())
        )
    );

    // We transform the data so that we can return it as json
    responses = responses.map(response => {
        return {
            data_category: response.page_name,
            data: response.data.data
        };
    });
    return JSON.stringify(responses, null, 4)
}

export async function run() {
    // Make sure we have a authorized session
    // await verifyLoggedInStatus();
    // await getAuthToken();

    // Fetch the data from the instagram API
    let responses = await fetchJsonFromAPI();
    
    // TODO Where should the json go?
    // We could also create a zip with jszip
    
    // For now we can offer to download them:
	let blob = new Blob( [ responses ], { type: 'data:text/json;charset=utf-8m'	});
	let url = URL.createObjectURL( blob );
    chrome.downloads.download({
        url: url,
        filename: 'instagram_data.json'
    });
}