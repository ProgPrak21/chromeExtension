
// Initialize button
let issueRequest = document.getElementById("issueRequest");

// When the button is clicked, inject clickPath on current page
issueRequest.addEventListener("click", async () => {
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // lets open the page to request your data as new tab but don't make it active
  var requestURL = "https://www.instagram.com/download/request/";
  
  let [reqTab] = await chrome.tabs.create({ url: requestURL, active: true }).then(() => {
    const tabId = getTabId();
    console.log(tabID);
    chrome.scripting.executeScript({
      code: `alert('injected');`,
      target: { tabId: tabId },
    });
  
  
  const tabId1 = getTabId();
  chrome.scripting.executeScript({
    target: { tabId: tabId1 },
    file: 'connectors/com.instagram.js'
  });
});
  
});