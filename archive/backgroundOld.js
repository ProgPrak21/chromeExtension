
// Define rules for activating the extension
chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      // With a new rule ...
      chrome.declarativeContent.onPageChanged.addRules([
        {
          // That fires when a page's URL contains a 'g' ...
          conditions: [
            new chrome.declarativeContent.PageStateMatcher({
              pageUrl: { hostEquals: 'www.instagram.com', schemes: ['https'] },
            })
            // enter other company domains here
          ],
          // And shows the extension's page action.
          actions: [ new chrome.declarativeContent.ShowPageAction() ]
        }
      ]);
    });
  });