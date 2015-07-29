/* MOBILE CONSOLE OBJECT */
function getMobileConsole() {
  var config = studio.mobile = {
    saveOnClose: true, // save on the clipboard the console contents
    console: [],
    consoleLog: [],
    getMobileConsoleFromStorage: function recoverMobileConsoleFromStorage() {
      var console = [];
      if (studio.extension.storage.getItem('mobileConsole')) {
        try {
          console = JSON.parse(studio.extension.storage.getItem('mobileConsole'));
        } catch (e) {}
      }
      if (this.saveOnClose && console.length == 0) {
        if (studio.readClipboard('mobileConsole').length > 0) {
          try {
            console = JSON.parse(studio.readClipboard('mobileConsole'));
          } catch (e) {}
        }
      }
      this.console = console;
    },
    saveMobileConsoleToStorage: function saveMobileConsoleToStorage() {
      studio.extension.storage.setItem('mobileConsole', JSON.stringify(this.console));
      if (this.saveOnClose && this.console.length > 0) {
        try {
          studio.writeClipboard('mobileConsole', JSON.stringify(this.console));
        } catch (e) {}
      }
    },
    appendConsoleMessage: function appendConsoleMessage(message, type, category) {
      if (message && message.length > 0) {
        // append the message in pending
        this.console.push({
          message: message,
          type: type || null,
          category: category || 'env',
          date: new Date().getTime()
        });
      }
      this.saveMobileConsoleToStorage();
    },
    clearConsoleMessages: function clearConsoleMessages() {
      this.console = [];
      studio.extension.storage.removeItem('mobileConsole');
      if (this.saveOnClose) {
        studio.writeClipboard('mobileConsole', JSON.stringify(this.console));
      }
    }
  }
  return config;
}
// CHECKS FOR ENVIRONMENT
if (typeof exports != 'undefined') {
  // BACKEND ENVIRONMENT
  exports.getConsole = getMobileConsole;
}