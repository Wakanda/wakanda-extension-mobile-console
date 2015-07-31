// WEBVIEW ENVIRONMENT
getMobileConsole();
studio.mobile.getMobileConsoleFromStorage();
studio.mobile.consoleIndex = studio.mobile.console.length;

function generateLogString(log) {
    var date = new Date(log.date).toLocaleTimeString();
    var logHTML = '',
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
        case 'DEBUG':
            logHTML = '<div class="message"><span class="category">[' + logCategory + ']</span><span class="type debug">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span>' + log.message + '</div>';
            break;
        case 'WARNING':
            logHTML = '<div class="message"><span class="category">[' + logCategory + ']</span><span class="type orange">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span><span class="orange">' + log.message + '</span></div>';
            break;
        case 'ERROR':
            logHTML = '<div class="message"><span class="category">[' + logCategory + ']</span><span class="type red">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span><span class="red">' + log.message + '</span></div>';
            break;
        case 'LOG':
            logHTML = '<div class="message"><span class="category">[' + logCategory + ']</span><span class="type">[' + log.type + ']</span> <span class="time">' + date.substring(0, 8) + '</span>' + log.message + '</div>';
            break;
        default:
            logHTML = '<div class="message"><span class="category">[' + logCategory + ']</span><span class="type">' + date.substring(0, 8) + '</span>' + log.message + '</div>';
            break;
    }
    return logHTML;
}

function checkLogConsole() {
    var consoleLog = studio.getConsoleLog();
    for (var i = 0; i < consoleLog.length; i++) {
        studio.mobile.appendConsoleMessage(consoleLog[i], 'LOG', 'backend');
    }
}

function checkMobileConsole() {
    studio.mobile.getMobileConsoleFromStorage();
    if (studio.mobile.console.length > 0) {
        for (var i = studio.mobile.consoleIndex; i < studio.mobile.console.length; i++) {
            var string = generateLogString(studio.mobile.console[i]);
            document.getElementById('console-body-all').innerHTML += string;
            document.getElementById('console-body-' + String(studio.mobile.console[i].category)).innerHTML += string;
            studio.mobile.consoleIndex++;
        }
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
        studio.mobile.console.forEach(function(log) {
            var string = generateLogString(studio.mobile.console[studio.mobile.consoleIndex]);
            document.getElementById('console-body-all').innerHTML += string;
            document.getElementById('console-body-' + String(studio.mobile.console[studio.mobile.consoleIndex].category)).innerHTML += string;
            studio.mobile.consoleIndex++;
        });
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
}

function clearMobileConsole() {
    studio.sendCommand('MobileConsole.clear');
    studio.mobile.consoleIndex = 0;
    var elements = document.getElementsByClassName('messages-container');
    for (var i in elements) {
        if (elements.hasOwnProperty(i)) {
            elements[i].innerHTML = '';
        }
    }
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
// ON START CHECK IF CONSOLE HAS MESSAGES
if (document.getElementById('console-body-all').innerHTML == '') {
    restoreMobileConsole();
}
// CHECK PERIODICALLY IF CONSOLE HAS MESSAGES
setInterval(function() {
    checkLogConsole();
    checkMobileConsole();
}, 250);