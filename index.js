var mobileConsole = require("./js/console.js");

exports.handleMessage = function handleMessage(message) {

	var mobileConsoleObject = mobileConsole.getConsole();

	mobileConsoleObject.getMobileConsoleFromStorage();

	if (message.action == 'open') {
		// open the webview
		studio.extension.openPageInTab('index.html', 'Mobile Console', false);
		if (mobileConsoleObject.console.length < 1) {
			// launch the first message
			var extensionManifest = JSON.parse(File(studio.extension.getFolder().path + '/manifest.json'));
			mobileConsoleObject.appendConsoleMessage(extensionManifest.extension.name + ' Console ' + extensionManifest.extension.version, 'DEBUG');
		}

	} else if (message.action == 'append') {
		if(message.params){
			var messageReceived = message.params;
			mobileConsoleObject.appendConsoleMessage(messageReceived.msg, messageReceived.type);
	  	}

	} else if (message.action == 'clear') {
		mobileConsoleObject.clearConsoleMessages();

	} else if (message.action == 'init') {
		// registerTabPage to add icon and description
		studio.extension.registerTabPage('index.html', 'icon.png', 'Mobile Console: shows the output of the ionic/cordova environment.');

	}
}