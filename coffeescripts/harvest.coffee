###
Harvest API Wrapper

Depends on:
  - jQuery
  - Sugar.js
  - Underscore.js
###

class Harvest
  constructor: (@subdomain, @auth_string) ->
    @full_url = "https://#{@subdomain}.harvestapp.com"
    @ajax_defaults =
      type: 'GET'
      dataType: 'json'
      headers:
        'Cache-Control': 'no-cache'
        'Authorization': "Basic #{@auth_string}"

  ###
  Build URL for and API call

  @private
  @param {String[]} arguments
  @returns {String}
  ###
  build_url = ->
    url = @full_url
    $.each arguments, (i, v) ->
      url += "/#{v}"
    "#{url}.json"

  ###
  Build an AJAX options object by merging with @ajax_defaults

  @private
  @param {Object} opts
  @returns {Object}
  ###
  build_ajax_options = (opts = {}) -> $.extend @ajax_defaults, opts
  
  ###
  Get API rate limit status

  @returns {jqXHR}
  ###
  rate_limit_status: (ajax_opts = {}) ->
    url = build_url.call this, 'account', 'rate_limit_status'
    $.ajax url, build_ajax_options.call(this, ajax_opts)
  
  ###
  Get all timesheet entries (and project list) for a given day

  @param {Date} date
  @param {Boolean} async
  @returns {jqXHR}
  ###
  get_day: (date, ajax_opts = {}) ->
    day_url   = if date is 'today' then build_url.call(this, 'daily') else build_url.call(this, 'daily', date.getDOY(), date.getFullYear())
    ajax_opts = build_ajax_options.call this, ajax_opts
    $.ajax day_url, ajax_opts
  
  ###
  Convenience method for getting today's entries

  @param {Boolean} async
  @returns {jqXHR}
  ###
  get_today: (ajax_opts = {}) ->
    @get_day('today', ajax_opts)
  
  ###
  Get an individual timer by ID

  @param {Number} eid
  @param {Boolean} async
  @returns {jqXHR}
  ###
  get_entry: (eid, ajax_opts = {}) ->
    url = build_url.call this, 'daily', 'show', eid
    ajax_opts = build_ajax_options.call this, ajax_opts
    $.ajax url, ajax_opts
  
  ###
  Find runaway timers from yesterday

  @param {Function} callback
  @param {Boolean} async
  @returns {jqXHR}
  ###
  runaway_timers: (callback = $.noop, ajax_opts = {}) ->
    yesterday = Date.create 'yesterday'
    request = @get_day yesterday, ajax_opts

    request.success (json) ->
      if json.day_entries?
        entries = json.day_entries
        runaways = _(entries).filter (entry) -> entry.hasOwnProperty 'timer_started_at'
        callback.call entries, runaways
  
  ###
  Toggle a single timer on/off

  @param {Number} eid
  @param {Boolean} async
  @returns {jqXHR}
  ###
  toggle_timer: (eid, ajax_opts = {}) ->
    url       = build_url.call this, 'daily', 'timer', String(eid)
    ajax_opts = build_ajax_options.call this, ajax_opts
    $.ajax url, ajax_opts
  
  ###
  Create a new entry, optional starting its timer on creation

  @param {Object} props
  @param {Boolean} async
  @returns {jqXHR}
  ###
  add_entry: (props, ajax_opts = {}) ->
    url       = build_url.call this, 'daily', 'add'
    ajax_opts = build_ajax_options.call this, $.extend(ajax_opts, type: 'POST', data: props)
    $.ajax url, ajax_opts
  
  ###
  Delete an entry

  @param {Number} eid
  @param {Boolean} async
  @returns {jqXHR}
  ###
  delete_entry: (eid, ajax_opts = {}) ->
    url       = build_url.call this, 'daily', 'delete', String(eid)
    ajax_opts = build_ajax_options.call this, $.extend(ajax_opts, type: 'DELETE')
    $.ajax url, ajax_opts
  
  ###
  Update an entry

  @param {Number} eid
  @param {Object} props
  @param {Boolean} async
  @returns {jqXHR}
  ###
  update_entry: (eid, props, ajax_opts = {}) ->
    url       = build_url.call this, 'daily', 'update', String(eid)
    ajax_opts = build_ajax_options.call this, $.extend(ajax_opts, type: 'POST', data: props)
    $.ajax url, ajax_opts

window.Harvest = Harvest
