/**
 * This script is being loaded on every https://intranet.hbtn.io/ page
 * it collects and prepare all data and notify user via action badge
 */

/**
 * Regex Documentation:
 * /(^\w+@[^\r\n]+[\r\n])/gm - looking for word with @ inside in the beginning of the line
 * /(^\[\d+\]|^->|^-&gt;|^==\d+==)[^\r\n]+[\r\n]/gm - looking for rare cases of terminal outputs
 */
 
var pre = document.getElementsByTagName('pre'),
    code, regex = /(^\w+@[^\r\n]+[\r\n])/gm,
    scanned, data = [],
    filename;

function check(line) {
    /* if line is not terminal command and is not empty and is not terminal output return true else return false */
    if (line.length > 0 && line.match(regex) == null) {
        var a = line.match(/hljs-([^"]+)/g);
        for (i in a) {
            if (a[i] != "hljs-number" && a[i] != "hljs-symbol" && a[i] != "hljs-string" && a[i] != "hljs-keyword") {
                return true
            }
        }
    }
    return false
}

for (i in pre) {
    if (pre[i].childNodes && pre[i].childNodes[0].tagName == 'CODE') {
        /* parsing contents of <code> tag */
        code = pre[i].childNodes[0].innerHTML;
        /* parsing file name from cat command */
        filename = code.match(/ cat [^\n]+/gm);
        /* creating html element to serve in the plugin */
        scanned = document.createElement('code');
        scanned.innerHTML = code;
        hljs.highlightBlock(scanned);

        /* splits code my terminal command */
        code = code.split(regex);
        scanned = scanned.innerHTML.split(regex).map(function(line, index) {
            return check(line) ? code[index] : ''
        }).join('').replace(/(^\[\d+\]|^->|^-&gt;|^==\d+==)[^\r\n]+[\r\n]/gm, '');

        /* formats file name */
        filename = filename && filename[0] ? filename[0].substr(5) : '';
        /* highlighting final sanitized code */
        code = document.createElement('code');
        code.innerHTML = scanned;
        hljs.highlightBlock(code)

        /* if there are valid code snippets, they are appended to a data array */
        /* the data pushed is an array as well. index 0 being unhighlighted code, index 1 is highlighted code
           index 2 is classname for highlighting, index 3 is the file name */
        scanned.length > 0 && data.push([scanned, code.innerHTML, code.className, filename]);
    }
}
/* if there is a valid data array count, then it pushes the count to the popup notifications */
data.length > 0 && chrome.extension.sendMessage({
    action: 'changeIcon',
    data: data.length
});
