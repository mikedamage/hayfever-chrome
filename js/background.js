/*!
 * Hayfever for Chrome
 * Background Script
 *
 * by Mike Green
 *
 * Released under the terms of the GNU GPLv2. See LICENSE for details.
 */

(function($) {
	$.hexPairToDecimal = function(hex) {
		return parseInt(hex, 16);
	};

	$.hexColorToRGBA = function(str, alpha) {
		var alphaVal = (typeof alpha == 'undefined' || typeof alpha != 'number') ? 255 : alpha
			, hexString = str.replace('#', '')
			, redVal = hexString.substring(0, 2)
			, greenVal = hexString.substring(2, 4)
			, blueVal = hexString.substring(4, 6);

		return [$.hexPairToDecimal(redVal), $.hexPairToDecimal(greenVal), $.hexPairToDecimal(blueVal), alphaVal];
	};
})(jQuery);

$(document).ready(function() {
	
	var popup = chrome.extension.getURL('popup.html')
 		, authString = localStorage['harvest_auth_string']
		, subdomain = localStorage['harvest_subdomain'];

	window.application = {
		version: '0.2.3'
		, authorized: false
		, totalHours: 0.0
		, currentHours: 0.0
		, todaysEntries: []
		, projects: []
		, clients: {}
		, preferences: {}
		, upgradeDetected: function() {
			var storedVersion = localStorage.getItem('hayfever_version');

			if (!storedVersion) {
				localStorage.setItem('hayfever_version', this.version);
				return false;
			} else {
				if (storedVersion == this.version) {
					return false
				} else {
					return true;
				}
			}
		}
		, startRefreshInterval: function() {
			this.refreshInterval = setInterval(window.application.refreshHours, 36000);
		}
		, getPreferences: function() {
			var prefs = localStorage.getItem('hayfever_prefs');
			if (prefs) {
				prefs = JSON.parse(prefs);
				window.application.preferences = prefs;
			}
			return window.application.preferences;
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
			var root = window.application
				, prefs = root.getPreferences()
				, badgeColor = $.hexColorToRGBA(prefs.badge_color)
				, badgeText;

			switch (prefs.badge_display) {
				case 'current':
					badgeText = (prefs.badge_format == 'decimal') ? root.currentHours.toFixed(2) : root.currentHours.toClockTime();
				break;
				case 'total':
					badgeText = (prefs.badge_format == 'decimal') ? root.totalHours.toFixed(2) : root.totalHours.toClockTime();
				break;
				case 'nothing':
					badgeText = '';
				break;
			}

			chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
			chrome.browserAction.setBadgeText({text: badgeText});
		}
		, refreshHours: function(callback) {
			console.log('refreshing hours');
			var root = window.application
				, prefs = root.getPreferences()
				, callback = (typeof callback === 'function') ? callback : function() {}
				, todaysHours = root.client.getToday();

			todaysHours.success(function(json) {
				root.authorized = true;

				var totalHours = 0.0
					, currentHours = '';
				
				// Cache projects and timesheet entries from JSON feed
				root.projects = json.projects;
				root.projectDB = TAFFY(root.projects);
				root.todaysEntries = json.day_entries;
				
				// Calculate total hours by looping thru timesheet entries
				$.each(root.todaysEntries, function() {
					totalHours += this.hours;

					if (this.hasOwnProperty('timer_started_at')) {
						currentHours = parseFloat(this.hours);
					}
				});
				root.totalHours = totalHours;
				root.currentHours = (typeof currentHours === 'number') ? currentHours : 0.0;
				
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
				callback.call(root.todaysEntries);
			});

			todaysHours.error(function(xhr, textStatus, errorThrown) {
				console.log("Error refreshing hours!");

				if (xhr.status == 401) {
					// Authentication Failure
					root.authorized = false;
					chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
					chrome.browserAction.setBadgeText({text: "!"});
				}
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

	window.application.init = function() {
		var root = window.application;

		if (root.authDataExists()) {
			var auth = root.getAuthData()
				, prefs = root.getPreferences();

			root.client = new Harvest(auth.subdomain, auth.auth_string);
			setTimeout(root.refreshHours, 500);
			root.startRefreshInterval();
			return true;
		} else {
			return false;
		}
	};

	if (!window.application.init()) {
		chrome.browserAction.setBadgeText({text: "!"});
		console.error("Error initializing Hayfever. Please visit the Options page");
	}
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
