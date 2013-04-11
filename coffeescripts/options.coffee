###
Hayfever for Chrome
Options Page JavaScript

by Mike Green (mike.is.green@gmail.com)
###

$ = jQuery
$.fn.selectOption = (val) ->
	this.find("option[value='#{val}']").attr 'selected', 'selected'
	this

$ ->
	$subdomain_field = $('#harvest-subdomain')
	$username_field  = $('#harvest-username')
	$password_field  = $('#harvest-password')
	$form_fields     = $('input[type!= "submit"], select')
	subdomain        = localStorage['harvest_subdomain']
	username         = localStorage['harvest_username']
	auth_string      = localStorage['harvest_auth_string']
	plugin_prefs     = localStorage['hayfever_prefs']
	bg_page          = chrome.extension.getBackgroundPage()

	# Badge color picker
	color_picker = $.farbtastic '#badge-color-picker', (color) ->
		$('#badge-color').val(color).css 'background-color', color
	
	# Populate form fields if options are already set
	$subdomain_field.val(subdomain) if subdomain
	$username_field.val(username) if username

	if auth_string
		$('#harvest-password').next('.hint').html """
		We've successfully used your password to build an authentication string. This field will remain blank because we don't actually store your password. You can enter a new password at any time to rebuild the authentication string.
		"""
	
	if plugin_prefs
		prefs = JSON.parse plugin_prefs

		$('#enable-analytics').attr('checked', 'checked') if prefs.enable_analytics? and prefs.enable_analytics
		$('#badge-display').selectOption(prefs.badge_display) if prefs.hasOwnProperty('badge_display')
		$('#badge-format').selectOption(prefs.badge_format) if prefs.hasOwnProperty('badge_format')

		if prefs.hasOwnProperty('badge_color')
			$('#badge-color').val prefs.badge_color
			color_picker.setColor prefs.badge_color

		$('#show-task-notes').attr('checked', 'checked') if prefs.hasOwnProperty('show_task_notes') and prefs.show_task_notes
		$('#badge-blink').attr('checked', 'checked') if prefs.hasOwnProperty('badge_blink') and prefs.badge_blink
	
	$('#options').submit (evt) ->
		prefs = {}
		temp_password = ''

		$form_fields.each ->
			field_name = $(this).attr 'name'
			field_type = $(this).attr 'type'
			field_val  = $(this).val()

			switch field_name
				when 'harvest_subdomain', 'harvest_username'
					localStorage.setItem field_name, field_val if field_val.length > 0
				when 'harvest_password'
					temp_password = field_val
				else
					if field_type == 'checkbox'
						prefs[field_name] = $(this).is(':checked')
						true
					else
						prefs[field_name] = field_val
						true

		if localStorage['harvest_username'] and temp_password
			b64_auth_string = btoa "#{localStorage['harvest_username']}:#{temp_password}"
			localStorage.setItem 'harvest_auth_string', b64_auth_string

		prefs.enable_analytics = false unless prefs.hasOwnProperty('enable_analytics')
		prefs.show_task_notes  = false unless prefs.hasOwnProperty('show_task_notes')

		localStorage.setItem 'hayfever_prefs', JSON.stringify(prefs)

		$('#status').addClass('success').html('Options successfully saved').fadeIn(400)
		window.scrollTo 0, 0

		# Refresh background page to load new options
		bg_page.location.reload()
		bg_page.application.start_refresh_interval() unless bg_page.application.refresh_interval
		false
					
