// not working yet
function createUrl(url) {
  return chrome.tabs.create({url}, function(tab) {
    return tab, new Promise(resolve => {
      chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info) {
        if (tab.id === tabId && info.status === 'complete') {
          chrome.tabs.onUpdated.removeListener(onUpdated);
          resolve();
        }
      });
    });
  });
}

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

// Initialize button
let issueRequest = document.getElementById("issueRequest");

// When the button is clicked, 
// inject connectors/com.instagram.js on instagram.com/download/request
issueRequest.addEventListener("click", async () => {
  // open the page to request the data in the current tab
  var requestURL = "https://www.instagram.com/download/request/";
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });  
  
  await goToUrl(tab, requestURL);
  //await createUrl(requestURL);
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['connectors/com.instagram.js']
  });
});