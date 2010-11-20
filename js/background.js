$(document).ready(function() {
	// TODO: Create badge w/ total hours worked today via chrome.browserAction.setBadgeText({text: "0:00"})
	
	var authString = localStorage['harvest_auth_string']
		, subdomain = localStorage['harvest_subdomain']
		, hurl = 'https://' + subdomain + '.harvestapp.com';

	if (_.isEmpty(authString) || _.isEmpty(subdomain)) {
		chrome.browserAction.setBadgeText({text: "!"});
	} else {
		$.ajax({
			url: hurl + '/daily'
			, type: 'GET'
			, dataType: 'xml'
			, beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', 'Basic ' + authString);
				xhr.setRequestHeader('Accept', 'application/xml');
				xhr.setRequestHeader('Content-Type', 'application/xml');
				return true;
			}
			, success: function(xml) {
				console.log('success');
				var hours = 0.0 
					, $dayEntries = $(xml).find('day_entries').find('day_entry');
				
				$dayEntries.each(function() {
					var hrs = $(this).find('hours').text()
						, floatHrs = parseFloat(hrs);
					hours += floatHrs;
				});
				chrome.browserAction.setBadgeText({text: '' + hours });
				console.log(hours);
			}
		});
	}
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
