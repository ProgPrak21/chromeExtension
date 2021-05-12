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

function executeScript(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: submitForm,
  });
}

export async function run(tab) {
  executeScript(tab);
}
