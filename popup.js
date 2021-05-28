async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

async function exists(hostname) {
  const response = await fetch(`/connectors/${hostname}.js`);
  if (response.status == 200) {
    return true;
  } else {
    return false;
  }
}

(async function () {
  let tab = await getCurrentTab();

  const url = tab.url;
  const { hostname } = new URL(url);

  if (await exists(hostname)) {
    const connector = await import(`/connectors/${hostname}.js`);    
    let br = document.createElement("br");

    // Update popup.html description div
    let descriptionDiv = document.getElementById("description");
    descriptionDiv.innerHTML = "This Site is supported!";

    // Create and initialize Request Button
    let issueRequestBtn = document.createElement("button");
    issueRequestBtn.id = "issueRequest";
    issueRequestBtn.innerHTML = "Request Data";
    document.body.append(issueRequestBtn);
    document.body.insertBefore(br, issueRequestBtn);

    issueRequestBtn.addEventListener("click", async () => {  
      await connector.run();
    });

    // Create and initialize Check Button
    let checkRequestBtn = document.createElement("button");
    checkRequestBtn.id = "requestCheck";
    checkRequestBtn.innerHTML = "Check Request";
    document.body.append(checkRequestBtn);
    document.body.insertBefore(br, checkRequestBtn);

    checkRequestBtn.addEventListener("click", async () => {
      await connector.check();
    });

    // Create and initialize Download Button
    let downloadRequestBtn = document.createElement("button");
    downloadRequestBtn.id = "requestDownload";
    downloadRequestBtn.innerHTML = "Download Request";
    document.body.append(downloadRequestBtn);
    document.body.insertBefore(br, downloadRequestBtn);

    downloadRequestBtn.addEventListener("click", async () => {
      await connector.download();
    });
  } else {
    // it not, display something like:
    // Sorry we don't support data requests from this site yet, if you want to help to support more pages you can do so here (link).
    // Here(link) you can find all pages we support requesting data from.

    let descriptionDiv = document.getElementById("description");
    descriptionDiv.innerHTML = "This site is not yet supported!";
  }
})();
