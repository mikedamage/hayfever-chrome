/**
 * Hayfever for Chrome
 * Background Script
 *
 * by Mike Green
 *
 * TODO: Figure out the best strategy for persisting data like client lists, either via Web SQL or localStorage. 
 * 			 If localStorage, use some easily query-able schema
 */

// String prototype method, convert string to slug
String.prototype.toSlug = function() {
	var slug = this.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().replace(/\s/g, '_');
	return slug;
};

$(document).ready(function() {
	// TODO: Create badge w/ total hours worked today via chrome.browserAction.setBadgeText({text: "0:00"})
	
	
	var popup = chrome.extension.getURL('popup.html')
 		, authString = localStorage['harvest_auth_string']
		, subdomain = localStorage['harvest_subdomain'];

	window.application = {
		totalHours: 0.0
		, todaysEntries: []
		, projects: []
		, clients: {}
		, harvestTab: null
		, startRefreshInterval: function() {
			this.refreshInterval = setInterval(window.application.refreshHours, 36000);
		}
		, getAuthData: function() {
			return {
				subdomain: localStorage['harvest_subdomain']
				, auth_string: localStorage['harvest_auth_string']
				, username: localStorage['harvest_username'] 
			};
		}
		, authDataExists: function() {
			var auth = this.getAuthData();
			return (!_(auth.subdomain).isEmpty() && !_(auth.auth_string).isEmpty());
		}
		, setBadge: function() {
			var root = window.application;
			chrome.browserAction.setBadgeBackgroundColor({color: [138, 195, 255, 200]}); // light blue
			chrome.browserAction.setBadgeText({text: String(root.totalHours.toFixed(2))});
		}
		, refreshHours: function() {
			console.log('refreshing hours');
			var root = window.application;
			root.client.getToday(function(xhr, txt) {
				var json = JSON.parse(xhr.responseText)
					, totalHours = 0.0;
				
				// Cache projects and timesheet entries from JSON feed
				root.projects = json.projects;
				root.projectDB = TAFFY(root.projects);
				root.todaysEntries = json.day_entries;
				
				// Calculate total hours by looping thru timesheet entries
				$.each(root.todaysEntries, function() {
					totalHours += this.hours;
				});
				root.totalHours = totalHours;
				
				// Build a grouped list of clients/projects for building optgroups later
				// TODO: Determine whether or not we actually need this object
				if (!_(root.projects).isEmpty()) {
					$.each(root.projects, function() {
						var clientKey = this.client.toSlug()
							, projectID = this.id;

						if (!root.clients[clientKey]) {
							root.clients[clientKey] = {
								name: this.client
								, projects: []
							};
						}
						var idExists = _(root.clients[clientKey].projects).detect(function(p) { return p.id == projectID; });

						if (!idExists) {
							root.clients[clientKey].projects.push(this);
						}
					});
				}
				root.setBadge();	
				//chrome.browserAction.setBadgeText({text: String(root.totalHours)});
			}, true);
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

	if (window.application.authDataExists()) {
		var auth = window.application.getAuthData();
		window.application.client = new Harvest(auth.subdomain, auth.auth_string);
		setTimeout(window.application.refreshHours, 500);
		window.application.startRefreshInterval();
	} else {	
		chrome.browserAction.setBadgeText({text: "!"});
	}
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
