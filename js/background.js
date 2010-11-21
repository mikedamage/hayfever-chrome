$(document).ready(function() {
	// TODO: Create badge w/ total hours worked today via chrome.browserAction.setBadgeText({text: "0:00"})
	var Application = {
		totalHours: 0.0
	};
	
	var popup = chrome.extension.getURL('popup.html')
 		, authString = localStorage['harvest_auth_string']
		, subdomain = localStorage['harvest_subdomain'];

	if (_.isEmpty(authString) || _.isEmpty(subdomain)) {
		chrome.browserAction.setBadgeText({text: "!"});
	} else {
		var harvest = new Harvest(subdomain, authString);
		harvest.getToday(function(xhr, txt) {
			var allHours = 0.0
				, json = JSON.parse(xhr.responseText);
			
			if (json.day_entries) {
				var numEntries = json.day_entries.length;
				for (var i = 0; i < numEntries; i++) {
					allHours += json.day_entries[i].hours;
				}
				Application.totalHours = allHours;
				chrome.browserAction.setBadgeText({text: String(Application.totalHours)});
			} else {
				chrome.browserAction.setBadgeText({text: "0.0"});
			}
		});
	}
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
