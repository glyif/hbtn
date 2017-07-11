/**
 * generating the extension popup
 */

/* if we are on right page we request data var from helper.js from current tab */
chrome.tabs.executeScript({
    /* displays error message by default */
    code: 'data'
}, function(data) {
    if (data[0][0].length > 0) {
        /* if there is valid data, then delete error */
        code.innerHTML = '';
        var pre;
        for (i in data[0]) {
            /* adding code in code tags into div#code */
            pre = document.createElement('pre');
            pre.innerHTML = '<code class="' + data[0][i][2] + '">' + data[0][i][1] + '</code>';
            pre.onclick = toggleActive;
            pre.code = data[0][i][0];
            pre.fileName = data[0][i][3];
            code.appendChild(pre)
        }
        /* highlighting first code element */
        code.childNodes[0].id = 'active';
        /* loading form if everything was loadede without errors */
        sidePanel.innerHTML = '<input placeholder="Enter file name (default is file.txt)" id="fileName" type="text" name="fileName"><button id="saveButton">Save</button>';
        /* asynchronously saves file in background */
        saveButton.onclick = function() {
            chrome.extension.sendMessage({
                action: 'saveFile',
                data: {
                    code: active.code,
                    name: fileName.value
                }
            });
        }
    }
});

/* popup code snippet click behaviour */
function toggleActive() {
    /* setting or setting file name */
    fileName.value = this.fileName;
    /* if we have active element we remove id active from it */
    active && active.removeAttribute("id");
    /* setting id as active for current element */
    this.id = "active"
}
