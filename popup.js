function goToUrl(tab, url) {
  chrome.tabs.update(tab.id, {url});
  return new Promise(resolve => {
    chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        resolve();
      }
    });
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

(async function(){
  var supportedHosts =  {
  'www.instagram.com':'https://www.instagram.com/download/request/', 
  'www.facebook.com':'www.facebook.com', 
  'www.ebay.de':'www.ebay.de',
  'www.redit.com':'www.redit.com'
  }

  tab = await getCurrentTab();
  const url = tab.url;
  const { hostname } = new URL(url);
  
  // Is the current site supported?
  if (supportedHosts.hasOwnProperty(hostname)) {
    // If yes: offer to request data

    // Update popup.html description div
    let descriptionDiv = document.getElementById("description");
    descriptionDiv.innerHTML = "This Site is supported!";

    // Create and initialize Button
    let issueRequestBtn = document.createElement("button"); 
    issueRequestBtn.id ='issueRequest';
    issueRequestBtn.innerHTML = "Request Data";
    document.body.append(issueRequestBtn);


    let br = document.createElement("br");
    document.body.insertBefore(br, issueRequestBtn);

    // When the button is clicked, inject connectors/tld.domain.subdomain.js into requestURL
    issueRequestBtn.addEventListener("click", async () => {
      // open the page to request the data in the current tab
      var requestURL = supportedHosts[hostname];
      let tab = await getCurrentTab();
      
      await goToUrl(tab, requestURL);
      //await createUrl(requestURL);
      
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [`connectors/${hostname}.js`]
      });
    });

  } else {
    // it not, display something like: 
    // Sorry we don't support data requests from this site yet, if you want to help to support more pages you can do so here (link).
    // Here(link) you can find all pages we support requesting data from.

    let descriptionDiv = document.getElementById("description");
    descriptionDiv.innerHTML = "This site is not yet supported!";

  }
})();

