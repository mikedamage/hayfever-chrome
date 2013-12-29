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

  @param {String[]} arguments
  @returns {String}
  ###
  _build_url: ->
    url = @full_url
    $.each arguments, (i, v) ->
      url += "/#{v}"
    "#{url}.json"

  ###
  Build an AJAX options object by merging with @ajax_defaults

  @param {Object} opts
  @returns {Object}
  ###
  _build_ajax_options: (opts = {}) -> $.extend @ajax_defaults, opts
  
  ###
  Get API rate limit status

  @returns {jqXHR}
  ###
  rate_limit_status: (ajax_opts = {}) ->
    url = @_build_url 'account', 'rate_limit_status'
    $.ajax url, @_build_ajax_options(ajax_opts)
  
  ###
  Get all timesheet entries (and project list) for a given day

  @param {Date} date
  @param {Boolean} async
  @returns {jqXHR}
  ###
  get_day: (date, ajax_opts = {}) ->
    day_url = if date is 'today' then @_build_url('daily') else @_build_url('daily', date.getDOY(), date.getFullYear())
    ajax_opts = @_build_ajax_options ajax_opts
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
    url = @_build_url 'daily', 'show', eid
    ajax_opts = @_build_ajax_options ajax_opts
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
  toggle_timer: (eid, ajax_opts) ->
    url       = @_build_url 'daily', 'timer', String(eid)
    ajax_opts = @_build_ajax_options ajax_opts
    $.ajax url, ajax_opts
  
  ###
  Create a new entry, optional starting its timer on creation

  @param {Object} props
  @param {Boolean} async
  @returns {jqXHR}
  ###
  add_entry: (props, ajax_opts = {}) ->
    url       = @_build_url 'daily', 'add'
    ajax_opts = @_build_ajax_options $.extend(ajax_opts, type: 'POST', data: props)
    $.ajax url, ajax_opts
  
  ###
  Delete an entry

  @param {Number} eid
  @param {Boolean} async
  @returns {jqXHR}
  ###
  delete_entry: (eid, ajax_opts = {}) ->
    url = @_build_url 'daily', 'delete', String(eid)
    ajax_opts = @_build_ajax_options $.extend(ajax_opts, type: 'DELETE')
    $.ajax url, ajax_opts
  
  ###
  Update an entry

  @param {Number} eid
  @param {Object} props
  @param {Boolean} async
  @returns {jqXHR}
  ###
  update_entry: (eid, props, ajax_opts = {}) ->
    url = @_build_url 'daily', 'update', String(eid)
    ajax_opts = @_build_ajax_options $.extend(ajax_opts, type: 'POST', data: props)
    $.ajax url, ajax_opts

window.Harvest = Harvest
