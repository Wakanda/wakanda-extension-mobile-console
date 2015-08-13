var mobileConsole = require("./js/console.js");
include('./js/ansispan.js');

exports.handleMessage = function handleMessage(message) {
	var mobileConsoleObject = mobileConsole.getConsole();
	mobileConsoleObject.getMobileConsoleFromStorage();
	if (message.action == 'open') {
		// open the webview
		studio.extension.openPageInTab('index.html', 'Mobile Console', false);

	} else if (message.action == 'append') {
		if (message.params) {
			var messageReceived = message.params,
				messageText = (typeof messageReceived === 'object') ? JSON.stringify(messageReceived.msg) : message.params,
				messageType = messageReceived.type || null,
				messageCategory = messageReceived.category;

			mobileConsoleObject.appendConsoleMessage(ansi2html(messageText), messageType, messageCategory);
		}
	} else if (message.action == 'clear') {
		mobileConsoleObject.clearConsoleMessages();

	} else if (message.action == 'init') {
		// registerTabPage to add icon and description
		studio.extension.registerTabPage('index.html', 'icon.png', 'Mobile Console: shows the output of the ionic/cordova environment.');
		if (mobileConsoleObject.console.length < 1) {
			// launch the first message
			var extensionManifest = JSON.parse(File(studio.extension.getFolder().path + '/manifest.json'));
			mobileConsoleObject.appendConsoleMessage(extensionManifest.extension.name + ' Console ' + extensionManifest.extension.version, 'DEBUG');
		}
	}
}
