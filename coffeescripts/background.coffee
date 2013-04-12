###
Background Page Main JavaScript
###

$ ->
	BackgroundApplication.get_auth_data (items) ->
		subdomain = items.harvest_subdomain
		auth_string = items.harvest_auth_string
	
		if subdomain and auth_string
			window.application = new BackgroundApplication subdomain, auth_string
			setTimeout window.application.refresh_hours, 500
			window.application.start_refresh_interval()
		else
			window.application = new BackgroundApplication false, false
			chrome.browserAction.setBadgeText text: '!'
			console.error 'Error initializing Hayfever. Please visit the options page.'
		
