$(document).ready(function() {
	// TODO: Create badge w/ total hours worked today via chrome.browserAction.setBadgeText({text: "0:00"})
	
	var authString = localStorage['harvest_auth_string']
		, subdomain = localStorage['harvest_subdomain']
		, hurl = 'https://' + subdomain + '.harvestapp.com';

	if (_.isEmpty(authString) || _.isEmpty(subdomain)) {
		chrome.browserAction.setBadgeText({text: "!"});
	} else {
		var harvest = new Harvest(subdomain, authString);
		harvest.getToday(function(xhr, txt) {
			var json = JSON.parse(xhr.responseText);
			chrome.browserAction.setBadgeText({text: "0"});
		});
	}
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
