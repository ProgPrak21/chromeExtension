function submitForm () {
    document.getElementById('igCoreRadioButtonoutputFormatJSON').checked = true;
    document.querySelector('form > div > button').click();
}

function executeScript (tab) {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: submitForm,
      });
}

export async function run(tab) {
    executeScript(tab);
}
