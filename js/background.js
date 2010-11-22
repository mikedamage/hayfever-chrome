$(document).ready(function() {
	// TODO: Create badge w/ total hours worked today via chrome.browserAction.setBadgeText({text: "0:00"})
	
	
	var popup = chrome.extension.getURL('popup.html')
 		, authString = localStorage['harvest_auth_string']
		, subdomain = localStorage['harvest_subdomain'];

	window.application = {
		totalHours: 0.0
		, todaysEntries: []
		, inPopup: function(func) {
			var fn = func
				, args = _.rest(arguments);
			$.each(chrome.extension.getViews(), function() {
				if (this.location.href == popup) {
					fn.apply(this, args);
				}
			});
		}
	};

	if (_.isEmpty(authString) || _.isEmpty(subdomain)) {
		chrome.browserAction.setBadgeText({text: "!"});
	} else {
		var harvest = new Harvest(subdomain, authString);
		harvest.getToday(function(xhr, txt) {
			var allHours = 0.0
				, json = JSON.parse(xhr.responseText);
			
			if (json.day_entries.length > 0) {
				var numEntries = json.day_entries.length;
				for (var i = 0; i < numEntries; i++) {
					allHours += json.day_entries[i].hours;
				}
				window.application.totalHours = allHours;
				window.application.todaysEntries = json.day_entries;
				chrome.browserAction.setBadgeText({text: String(window.application.totalHours)});
			} else {
				chrome.browserAction.setBadgeText({text: "0"});
			}
		});
	}
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
