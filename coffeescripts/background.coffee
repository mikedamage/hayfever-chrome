###
Background Page Main JavaScript
###

$ ->
	auth_data =
		subdomain: localStorage['harvest_subdomain']
		auth_string: localStorage['harvest_auth_string']
		username: localStorage['harvest_username']
	
	unless auth_data.subdomain.isEmpty() or auth_data.auth_string.isEmpty()
		window.application = new BackgroundApplication auth_data.subdomain, auth_data.auth_string
		setTimeout window.application.refresh_hours, 500
		window.application.start_refresh_interval()
	else
		chrome.browserAction.setBadgeText text: '!'
		console.error 'Error initializing Hayfever. Please visit the options page.'
		
