###
Background Page Application Class
###

class BackgroundApplication
  constructor: (@subdomain, @auth_string) ->
    @client = new Harvest(@subdomain, @auth_string)
    @version = '0.3.4'
    @authorized = false
    @total_hours = 0.0
    @current_hours = 0.0
    @current_task = null
    @badge_flash_interval = 0
    @refresh_interval = 0
    @refresh_interval_time = 36e3
    @todays_entries = []
    @projects = []
    @preferences = {}
    @timer_running = false

    chrome.browserAction.setTitle title: "Hayfever for Harvest"
    @register_message_listeners()
  
  # Class Methods
  @get_auth_data: (callback) ->
    chrome.storage.local.get [ 'harvest_subdomain', 'harvest_auth_string', 'harvest_username' ], (items) ->
      callback(items)
  
  @get_preferences: (callback) ->
    chrome.storage.local.get 'hayfever_prefs', (items) ->
      callback(items)
  
  @migrate_preferences: (callback) ->
    options =
      harvest_subdomain: localStorage['harvest_subdomain']
      harvest_auth_string: localStorage['harvest_auth_string']
      harvest_username: localStorage['harvest_username']
    prefs = if localStorage['hayfever_prefs'] then JSON.parse(localStorage['hayfever_prefs']) else null
    options.hayfever_prefs = prefs if prefs

    chrome.storage.local.set options, ->
      callback(options)
  
  # Instance Methods  
  upgrade_detected: ->
    stored_version = localStorage.getItem 'hayfever_version'

    unless stored_version
      localStorage.setItem 'hayfever_version', @version
      false
    else
      stored_version == @version

  register_message_listeners: ->
    console.debug "Registering asynchronous message listeners"
    chrome.runtime.onMessage.addListener (request, sender, send_response) =>
      send_json_response = (json) => send_response json

      console.debug "Received message from popup: %s", request.method

      if request.method is 'refresh_hours'
        @refresh_hours =>
          send_response
            authorized: @authorized
            projects: @projects
            clients: @clients
            timers: @todays_entries
            total_hours: @total_hours
            current_hours: @current_hours
            current_task: @current_task
            harvest_url: if @client.subdomain then @client.full_url else null
            preferences: @preferences
        true
      else if request.method is 'get_entries'
        send_response
          authorized: @authorized
          projects: @projects
          clients: @clients
          timers: @todays_entries
          total_hours: @total_hours
          current_hours: @current_hours
          current_task: @current_task
          harvest_url: if @client.subdomain then @client.full_url else null
          preferences: @preferences
       else if request.method is 'get_preferences'
         @get_preferences (prefs) =>
           send_response preferences: prefs
         true
       else if request.method is 'add_timer'
         if request.active_timer_id != 0
           result = @client.update_entry request.active_timer_id, request.task
         else
           result = @client.add_entry request.task

         result.success send_json_response
         true
       else if request.method is 'toggle_timer'
         result = @client.toggle_timer request.timer_id
         result.complete send_json_response
         true
       else if request.method is 'delete_timer'
         result = @client.delete_entry request.timer_id
         result.complete send_json_response
         true
  
  start_refresh_interval: ->
    @refresh_interval = setInterval @refresh_hours, @refresh_interval_time
  
  get_preferences: (callback = $.noop) ->
    BackgroundApplication.get_preferences (items) =>
      @preferences = items.hayfever_prefs || {}
      callback(items)
  
  get_auth_data: (callback) ->
      
  auth_data_exists: ->
    auth = @get_auth_data()
    !auth.subdomain.isBlank() and !auth.auth_string.isBlank()
  
  set_badge: =>
    @get_preferences()
    prefs = @preferences
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
  
  refresh_hours: (callback, force=false) =>
    console.log 'refreshing hours'
    @get_preferences()
    prefs        = @preferences
    callback     = if typeof callback is 'function' then callback else $.noop
    todays_hours = @client.get_today()

    todays_hours.success (json) =>
      @authorized   = true
      @current_task = null
      total_hours   = 0.0
      current_hours = ''

      @projects = json.projects
      @todays_entries = json.day_entries

      # Add up total hours by looping thru timesheet entries
      $.each @todays_entries, (i, v) =>
        total_hours += v.hours

        if v.hasOwnProperty('timer_started_at') and v.timer_started_at
          current_hours = parseFloat(v.hours)
          v.running = true
          @current_task = v

        @todays_entries[i] = v
      @total_hours = total_hours

      if typeof current_hours is 'number'
        @current_hours = current_hours
        @timer_running = true
        @start_badge_flash()
        chrome.browserAction.setTitle title: "Currently working on: #{@current_task.client} - #{@current_task.project}"
      else
        @current_hours = 0.0
        @timer_running = false
        @stop_badge_flash()
        chrome.browserAction.setTitle title: 'Hayfever for Harvest'

      @set_badge()
      callback.call(@todays_entries)

    todays_hours.error (xhr, text_status, error_thrown) =>
      console.log 'Error refreshing hours!'

      if xhr.status == 401
        # Authentication failure
        @authorized = false
        chrome.browserAction.setBadgeBackgroundColor color: [255, 0, 0, 255]
        chrome.browserAction.setBadgeText text: '!'
  
  badge_color: (alpha) =>
    @get_preferences()
    prefs = @preferences
    color = $.hexColorToRGBA prefs.badge_color, alpha
    chrome.browserAction.setBadgeBackgroundColor color: color
  
  badge_flash: (alpha) =>
    @badge_color(255)
    setTimeout @badge_color, 1000, 100
  
  start_badge_flash: ->
    console.log 'Starting badge blink'
    @get_preferences()
    prefs = @preferences

    if @badge_flash_interval is 0 and prefs.badge_blink
      @badge_flash_interval = setInterval @badge_flash, 2000
  
  stop_badge_flash: ->
    if @badge_flash_interval != 0
      console.log 'Stopping badge blink'
      clearInterval @badge_flash_interval
      @badge_flash_interval = 0
      @badge_color 255

window.BackgroundApplication = BackgroundApplication
