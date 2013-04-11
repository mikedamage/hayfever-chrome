###
Background Page Main JavaScript
###

$ ->
	auth_data = BackgroundApplication.get_auth_data()
	subdomain = auth_data.subdomain
	auth_string = auth_data.auth_string
	
	if subdomain and auth_string
		window.application = new BackgroundApplication auth_data.subdomain, auth_data.auth_string
		setTimeout window.application.refresh_hours, 500
		window.application.start_refresh_interval()
	else
		window.application = new BackgroundApplication false, false
		chrome.browserAction.setBadgeText text: '!'
		console.error 'Error initializing Hayfever. Please visit the options page.'
		
