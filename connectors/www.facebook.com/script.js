function submitForm() {
  let exist = Array.from(document.querySelectorAll("iframe")).map((iframe) =>
    Array.from(
      iframe.contentWindow.document.body.querySelectorAll('div[role="heading"]')
    ).find((e) =>
      e.textContent.startsWith("A copy of your information is being created.")
    )
  );

  //TODO: find a better way than alert
  if (exist) return alert("Request is pending!");

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

function executeScript(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: submitForm,
  });
}

export async function run(tab) {
  executeScript(tab);
}
