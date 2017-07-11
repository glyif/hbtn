/** async task helpers **/

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    /** Adding icon notifications for number of possible code snippets **/
    if (request.action == "changeIcon") {
        chrome.browserAction.setBadgeText({
            text: String(request.data),
            tabId: sender.tab.id
        })
    }
    /** Saves a code snippet **/
    else if (request.action == "saveFile") {
        chrome.downloads.download({
            url: 'data:text;charset=utf-8,' + encodeURI(request.data.code),
            filename: (request.data.name || 'file.txt'),
            conflictAction: 'uniquify'
        }, function(a, b, c, d) {})
    }
})
