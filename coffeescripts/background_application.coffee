###
Background Page Application Class
###

class BackgroundApplication
	constructor: (@subdomain, @auth_string) ->
		@client = new Harvest(@subdomain, @auth_string)
		@version = '0.3.0'
		@authorized = false
		@total_hours = 0.0
		@current_hours = 0.0
		@badge_flash_interval = 0
		@refresh_interval = 0
		@todays_entries = []
		@projects = []
		@clients = {}
		@preferences = {}
		@timer_running = false
	
	# Class Methods
	@get_auth_data: ->
		data =
			subdomain: localStorage.getItem 'harvest_subdomain'
			auth_string: localStorage.getItem 'harvest_auth_string'
			username: localStorage.getItem 'harvest_username'
		data
	
	@get_preferences: ->
		prefs = localStorage.getItem 'hayfever_prefs'
		if prefs then JSON.parse(prefs) else {}
	
	get_version: ->
		@version

	# Instance Methods	
	upgrade_detected: ->
		stored_version = localStorage.getItem 'hayfever_version'

		unless stored_version
			localStorage.setItem 'hayfever_version', @version
			false
		else
			stored_version == @version
	
	start_refresh_interval: ->
		@refresh_interval = setInterval @refresh_hours, 36000
	
	get_preferences: ->
		@preferences = BackgroundApplication.get_preferences()
	
	get_auth_data: ->
		data =
			subdomain: localStorage.getItem 'harvest_subdomain'
			auth_string: localStorage.getItem 'harvest_auth_string'
			username: localStorage.getItem 'harvest_username'
		data
	
	auth_data_exists: ->
		auth = @get_auth_data()
		!auth.subdomain.isBlank() and !auth.auth_string.isBlank()
	
	set_badge: ->
		prefs = BackgroundApplication.get_preferences()
		badge_color = $.hexColorToRGBA prefs.badge_color

		switch prefs.badge_display
			when 'current'
				badge_text = if prefs.badge_format is 'decimal' then @current_hours.toFixed(2) else @current_hours.toClockTime()
			when 'total'
				badge_text = if prefs.badge_format is 'decimal' then @total_hours.toFixed(2) else @total_hours.toClockTime()
			else
				badge_text = ''

		chrome.browserAction.setBadgeBackgroundColor color: badge_color
		chrome.browserAction.setBadgeText text: badge_text
	
	refresh_hours: (callback) =>
		console.log 'refreshing hours'
		prefs = BackgroundApplication.get_preferences()
		callback = if typeof callback is 'function' then callback else $.noop
		todays_hours = @client.get_today()

		todays_hours.success (json) =>
			@authorized = true
			total_hours = 0.0
			current_hours = ''

			@projects = json.projects
			@project_db = TAFFY(@projects)
			@todays_entries = json.day_entries

			# Add up total hours by looping thru timesheet entries
			$.each @todays_entries, (i, v) ->
				total_hours += v.hours
				current_hours = parseFloat(v.hours) if v.timer_started_at?
			@total_hours = total_hours

			if typeof current_hours is 'number'
				@current_hours = current_hours
				@timer_running = true
				@start_badge_flash()
			else
				@current_hours = 0.0
				@timer_running = false
				@stop_badge_flash()

			# Build a grouped list of clients/projects for building optgroups in markup later
			unless @projects.isEmpty()
				clients = {}
				projects = @projects
				$.each @projects, (i, v) ->
					client_key = v.client.toSlug()
					project_id = v.id
					clients[client_key] = {name: v.client, projects: []} unless clients[client_key]
					client = clients[client_key]
					id_exists = _(client.projects).detect (p) ->
						p.id == project_id

					clients[client_key].projects.push(v) unless id_exists

			@set_badge()
			callback.call(@todays_entries)

		todays_hours.error (xhr, text_status, error_thrown) =>
			console.log 'Error refreshing hours!'

			if xhr.status == 401
				# Authentication failure
				@authorized = false
				chrome.browserAction.setBadgeBackgroundColor color: [255, 0, 0, 255]
				chrome.browserAction.setBadgeText text: '!'
	
	badge_color: (alpha) ->
		prefs = @get_preferences
		color = $.hexColorToRGBA prefs.badge_color, alpha
		chrome.browserAction.setBadgeBackgroundColor color: color
	
	badge_flash: (alpha) ->
		@badge_color(255)
		setTimeout @badge_color, 1000, 100
	
	start_badge_flash: ->
		console.log 'Starting badge blink'
		prefs = @get_preferences()

		if @badge_flash_interval is 0 and prefs.badge_blink
			@badge_flash_interval = setInterval @badge_flash, 2000
	
	stop_badge_flash: ->
		if @badge_flash_interval != 0
			console.log 'Stopping badge blink'
			clearInterval @badge_flash_interval
			@badge_flash_interval = 0
			@badge_color 255

window.BackgroundApplication = BackgroundApplication
