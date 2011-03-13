/*!
 * Hayfever for Chrome
 * Omnibox Script
 * 
 * by Mike Green
 *
 * The plan here is to build a simple CLI-like interface to Hayfever's timesheets
 */

(function() {
	var app = window.application;

	chrome.omnibox.onInputChanged.addListener(function() {
		suggest([{content: "Hello World", description: "Foo bar baz."}]);
	});
})();
