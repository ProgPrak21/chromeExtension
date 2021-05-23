async function openUrl(tabToUpdate, url) {
  await chrome.tabs.update(tabToUpdate.id, { url });
  return new Promise((resolve) => {
    chrome.tabs.onUpdated.addListener(function onUpdated(tabId, info, tab) {
      if (tabId === tabToUpdate.id && info.status === "complete") {
        chrome.tabs.onUpdated.removeListener(onUpdated);
        resolve(tab);
      }
    });
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function submitForm() {
  Array.from(document.querySelectorAll("iframe")).forEach((iframe) => {
    Array.from(iframe.contentWindow.document.body.querySelectorAll("label"))
      ?.find((e) => e.textContent.startsWith("Format"))
      ?.querySelector("a")
      ?.click();

    Array.from(
      iframe.contentWindow.document.body.querySelectorAll(
        'a[role="menuitemcheckbox"]'
      )
    )
      ?.find((e) => e.textContent === "JSON")
      ?.click();

    Array.from(iframe.contentWindow.document.body.querySelectorAll("button"))
      ?.find((el) => el.textContent === "Create File")
      ?.click?.();
  });
}

async function checkRequest() {
  // await fetch("https://www.facebook.com/dyi/?referrer=yfi_settings").then(
  //   () => {
  //     let pending = Array.from(document.querySelectorAll("iframe")).map(
  //       (iframe) =>
  //         Array.from(
  //           iframe.contentWindow.document.body.querySelectorAll(
  //             'div[role="heading"]'
  //           )
  //         ).find((e) =>
  //           e.textContent.startsWith(
  //             "A copy of your information is being created."
  //           )
  //         )
  //     );

  //     let ready = Array.from(document.querySelectorAll("iframe")).map(
  //       (iframe) =>
  //         Array.from(
  //           iframe.contentWindow.document.body.querySelectorAll(
  //             'div[data-hover="tooltip"]'
  //           )
  //         ).find((e) => e.textContent.startsWith("Download"))
  //     );

  //     if (!pending.includes(undefined) && pending.length === 1) {
  //       console.log("Pending!");
  //       alert("Pending!");
  //     }
  //     if (!ready.includes(undefined) && ready.length === 1) {
  //       console.log("Ready!");
  //       alert("Ready!");
  //     }
  //   }
  // );

  let pending = Array.from(document.querySelectorAll("iframe")).map((iframe) =>
    Array.from(
      iframe.contentWindow.document.body.querySelectorAll('div[role="heading"]')
    ).find((e) =>
      e.textContent.startsWith("A copy of your information is being created.")
    )
  );

  let ready = Array.from(document.querySelectorAll("iframe")).map((iframe) =>
    Array.from(
      iframe.contentWindow.document.body.querySelectorAll(
        'div[data-hover="tooltip"]'
      )
    ).find((e) => e.textContent.startsWith("Download"))
  );

  console.log(pending);
  console.log(ready);
  if (!pending.includes(undefined) && pending.length === 1) {
    console.log("Request is pending!");
    alert("Pending!");
  }
  if (!ready.includes(undefined) && ready.length === 1) {
    console.log("Request is Ready");
    alert("Ready!");
  }
}

async function downloadData() {
  Array.from(document.querySelectorAll("iframe")).map((iframe) =>
    Array.from(
      iframe.contentWindow.document.body.querySelectorAll(
        'div[data-hover="tooltip"]'
      )
    )
      .find((e) => e.textContent.startsWith("Download"))
      .click()
  );
}

async function executeRunScript(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: submitForm,
  });
}

async function executeCheckScript(tab) {
  return chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: checkRequest,
  });
}

async function executeDownloadScript(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: downloadData,
  });
}

export async function run() {
  let url = "https://www.facebook.com/dyi/?referrer=yfi_settings";
  let tab = await getCurrentTab();
  await openUrl(tab, url);
  document.addEventListener("load", executeRunScript(tab));
}

export async function check() {
  let url = "https://www.facebook.com/dyi/?referrer=yfi_settings";
  let tab = await getCurrentTab();
  await openUrl(tab, url);
  document.addEventListener("load", executeCheckScript(tab));
}

export async function download() {
  let url = "https://www.facebook.com/dyi/?referrer=yfi_settings";
  let tab = await getCurrentTab();
  await openUrl(tab, url);
  document.addEventListener("load", executeDownloadScript(tab));
}
