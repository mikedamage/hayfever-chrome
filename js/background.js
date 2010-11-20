$(document).ready(function() {
	// TODO: Create badge w/ total hours worked today via chrome.browserAction.setBadgeText({text: "0:00"})
	
	var authString = localStorage['harvest_auth_string'];

	if (!authString) {
		chrome.browserAction.setBadgeText({text: "!"});
	}
});
