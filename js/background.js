$(document).ready(function() {
	// TODO: Create badge w/ total hours worked today via chrome.browserAction.setBadgeText({text: "0:00"})
	
	
	var popup = chrome.extension.getURL('popup.html')
 		, authString = localStorage['harvest_auth_string']
		, subdomain = localStorage['harvest_subdomain'];

	window.application = {
		totalHours: 0.0
		, todaysEntries: []
		, client: new Harvest(localStorage['harvest_subdomain'], localStorage['harvest_auth_string'])
		, setBadge: function() {
			var root = window.application;
			chrome.browserAction.setBadgeText({text: String(root.totalHours)});
		}
		, refreshHours: function() {
			console.log('refreshing hours');
			var root = window.application;
			root.client.getToday(function(xhr, txt) {
				var json = JSON.parse(xhr.responseText)
					, totalHours = 0.0;
				root.todaysEntries = json.day_entries;
				$.each(root.todaysEntries, function() {
					totalHours += this.hours;
				});
				root.totalHours = totalHours;
				chrome.browserAction.setBadgeText({text: String(root.totalHours)});
			});
		}
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
		setTimeout(window.application.refreshHours, 500);
		var refreshInterval = setInterval(window.application.refreshHours, 30000);
	}
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
