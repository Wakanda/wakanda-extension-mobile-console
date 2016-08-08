// WEBVIEW ENVIRONMENT
var CONSOLE_MESSAGES_LIMIT = 200;
getMobileConsole();
studio.mobile.getMobileConsoleFromStorage();
studio.mobile.consoleIndex = studio.mobile.console.length;

function removeUnsafeHTMLchars(inputString) {
    // remove unsafe html characters
    var str = inputString;
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/\n/g, '{%br%}');
    str = str.replace(/{%|%}/g, function(string) {
        return string = string.replace(/{%/g, "<").replace(/%}/g, ">");
    });
    return str;
}

function generateLogString(log) {
    var date = new Date(log.date).toLocaleTimeString();
    var logHTML = '',
        logMessage = removeUnsafeHTMLchars(log.message),
        logCategory = '';

    switch (log.category) {
        case 'env':
            logCategory = 'Environment';
            break;
        case 'build':
            logCategory = 'Build';
            break;
        case 'backend':
            logCategory = 'Backend';
            break;
        default:
            logCategory = '?';
            break;
    };
    switch (log.type) {
        case 'OUTPUT':
            logHTML = '<div><span class="category">[' + logCategory + ']</span><span class="type debug">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span></div>' + logMessage;
            break;
        case 'COMMAND':
            logHTML = '<span class="category">[' + logCategory + ']</span><span class="type debug">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span>$ ' + logMessage;
            break;
        case 'WARNING':
            logHTML = '<span class="category">[' + logCategory + ']</span><span class="type orange">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span><span class="orange">' + logMessage + '</span>';
            break;
        case 'ERROR':
            logHTML = '<span class="category">[' + logCategory + ']</span><span class="type red">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span>' + logMessage;
            break;
        case 'LOG':
            logHTML = '<span class="category">[' + logCategory + ']</span><span class="type">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span>' + logMessage;
            break;
        default:
            logHTML = '<span class="category">[' + logCategory + ']</span><span class="type">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span>' + logMessage;
            break;
    }
    return logHTML;
}

function checkLogConsole() {
    var consoleLog = studio.getConsoleLog();
    for (var i = 0; i < consoleLog.length; i++) {
        studio.mobile.appendConsoleMessage(consoleLog[i], 'LOG', 'backend');
        setScroll();
    }
}

function renderConsoleMessages() {
    if (studio.mobile.console.length < studio.mobile.consoleIndex) {
        return false;
    }

    var fragments = {};

    fragments['console-body-all'] = document.createDocumentFragment();

    studio.mobile.console.forEach(function(log, i) {
        if (i >= studio.mobile.consoleIndex) {
            // create message div
            var div = document.createElement("div");
            div.innerHTML = generateLogString(log);
            div.className = 'message';

            // append log to "all" fragment
            fragments['console-body-all'].appendChild(div);

            // append log to the specific log category fragment
            var category = 'console-body-' + String(log.category);
            if (!category) {
                return;
            }
            if (!fragments[category]) {
                fragments[category] = document.createDocumentFragment();
            }
            var categoryDiv = div.cloneNode(true);
            fragments[category].appendChild(categoryDiv);
            studio.mobile.consoleIndex++;
        }
    });
    Object.keys(fragments).forEach(function(fragmentId) {
        document.getElementById(fragmentId).appendChild(fragments[fragmentId]);
        // clear front-end
        var messages = document.getElementById(fragmentId).getElementsByClassName('message');
        for (var i = 0; i < messages.length; i++) {
            if (messages.length - i > CONSOLE_MESSAGES_LIMIT) {
                messages[i].remove();
                i--;
            }
        }
    });

    // clear console memory if over max
    if (studio.mobile.console.length > CONSOLE_MESSAGES_LIMIT) {
        studio.mobile.clearConsoleMessages();
        studio.mobile.consoleIndex = 0;
    }

}

function checkMobileConsole() {
    studio.mobile.getMobileConsoleFromStorage();
    if (studio.mobile.console.length > studio.mobile.consoleIndex) {
        renderConsoleMessages();
        setScroll();
    } else if (studio.mobile.console.length == 0 && studio.mobile.consoleIndex > 0) {
        studio.mobile.consoleIndex = 0;
        clearFrontendConsole();
        setScroll();
    }
}

function restoreMobileConsole() {
    studio.mobile.getMobileConsoleFromStorage();
    if (studio.mobile.console.length > 0) {
        var elements = document.getElementsByClassName('messages-container');
        for (var i in elements) {
            if (elements.hasOwnProperty(i)) {
                elements[i].innerHTML = '';
            }
        }
        studio.mobile.consoleIndex = 0;
        renderConsoleMessages();
    }
}

function changeTab(tabName) {
    var elements = document.getElementsByClassName('messages-tab');
    for (var i in elements) {
        if (elements.hasOwnProperty(i)) {
            elements[i].className = 'messages-tab';
        }
    }
    document.getElementById('console-tab-' + tabName).className = 'messages-tab active';
    elements = document.getElementsByClassName('messages-container');
    for (var i in elements) {
        if (elements.hasOwnProperty(i) && elements[i].style) {
            elements[i].style.display = '';
        }
    }
    document.getElementById('console-body-' + tabName).style.display = 'block';
    studio.mobile.activeConsoleBody = 'console-body-' + tabName;
    setScroll();
}

function clearFrontendConsole() {
    studio.mobile.consoleIndex = 0;
    var elements = document.getElementsByClassName('messages-container');
    for (var i in elements) {
        if (elements.hasOwnProperty(i)) {
            elements[i].innerHTML = '';
        }
    }
}

function clearMobileConsole() {
    studio.sendCommand('wakanda-extension-mobile-console.clear');
}

function toggleOptions(mode) {
    if (mode == true) {
        document.getElementById('options-container').style.display = 'block';
    } else if (mode == false) {
        document.getElementById('options-container').style.display = 'none';
    } else {
        if (document.getElementById('options-container').style.display && document.getElementById('options').style.display == 'block') {
            document.getElementById('options-container').style.display = 'none';
        } else {
            document.getElementById('options-container').style.display = 'block';
        }
    }
}

function toggleTime() {
    if (document.getElementById('toggleTime').className == 'switch') {
        document.getElementById('toggleTime').className = 'switch active';
        document.getElementById('console').classList.add("time");
    } else {
        document.getElementById('toggleTime').className = 'switch';
        document.getElementById('console').classList.remove("time");
    }
}

function toggleType() {
    if (document.getElementById('toggleType').className == 'switch') {
        document.getElementById('toggleType').className = 'switch active';
        document.getElementById('console').classList.add("debug");
    } else {
        document.getElementById('toggleType').className = 'switch';
        document.getElementById('console').classList.remove("debug");
    }
}

function setScroll() {
    var elm = document.getElementById(studio.mobile.activeConsoleBody);
    elm.scrollTop = elm.scrollHeight;
}
// ON START CHECK IF CONSOLE HAS MESSAGES
if (document.getElementById('console-body-all').innerHTML == '') {
    restoreMobileConsole();
}
// CHECK PERIODICALLY IF CONSOLE HAS MESSAGES
studio.mobile.activeConsoleBody = 'console-body-all';
setInterval(function() {
    checkLogConsole();
    checkMobileConsole();
}, 250);
