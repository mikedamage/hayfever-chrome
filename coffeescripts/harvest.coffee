###
Harvest API Wrapper

Depends on:
	- jQuery
	- Sugar.js
	- Underscore.js
###

class Harvest
	constructor: (@subdomain, @auth_string) ->
		@full_url = "http://#{@subdomain}.harvestapp.com"
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
	build_url: ->
		url = @full_url
		$.each arguments, (i, v) ->
			url += "/#{v}"
		"#{url}.json"
	
	###
	Get API rate limit status

	@returns {jqXHR}
	###
	rate_limit_status: ->
		url = @build_url 'account', 'rate_limit_status'
		$.ajax url, @ajax_defaults
	
	###
	Get all timesheet entries (and project list) for a given day

	@param {Date} date
	@param {Boolean} async
	@returns {jqXHR}
	###
	get_day: (date, async=true) ->
		day_url = if date is 'today' then @build_url('daily') else @build_url(date.getDOY(), date.getFullYear())
		ajax_opts = $.extend @ajax_defaults, async: async
		$.ajax day_url, ajax_opts
	
	###
	Convenience method for getting today's entries

	@param {Boolean} async
	@returns {jqXHR}
	###
	get_today: (async=true) ->
		@get_day('today', async)
	
	###
	Get an individual timer by ID

	@param {Number} eid
	@param {Boolean} async
	@returns {jqXHR}
	###
	get_entry: (eid, async=true) ->
		url = @build_url 'daily', 'show', eid
		ajax_opts = $.extend @ajax_defaults, async: async
		$.ajax url, ajax_opts
	
	###
	Find runaway timers from yesterday

	@param {Boolean} async
	@returns {Boolean}
	###
	runaway_timers: (async=true) ->
		yesterday = Date.create 'yesterday'
		request = @get_day yesterday, async

		request.success (json) ->
			if json.day_entries?
				entries = json.day_entries
				_(entries).detect (entry) ->
					entry.timer_started_at?
	
	###
	Toggle a single timer on/off

	@param {Number} eid
	@param {Boolean} async
	@returns {jqXHR}
	###
	toggle_timer: (eid, async=true) ->
		url = @build_url 'daily', 'timer', String(eid)
		ajax_opts = $.extend @ajax_defaults, async: async
		$.ajax url, ajax_opts
	
	###
	Create a new entry, optional starting its timer on creation

	@param {Object} props
	@param {Boolean} async
	@returns {jqXHR}
	###
	add_entry: (props, async=true) ->
		url = @build_url 'daily', 'add'
		ajax_opts = $.extend @ajax_defaults, type: 'POST', async: async, data: props
		$.ajax url, ajax_opts
	
	###
	Delete an entry

	@param {Number} eid
	@param {Boolean} async
	@returns {jqXHR}
	###
	delete_entry: (eid, async=true) ->
		url = @build_url 'daily', 'delete', String(eid)
		ajax_opts = $.extend @ajax_defaults, type: 'DELETE', async: async
		$.ajax url, ajax_opts
	
	###
	Update an entry

	@param {Number} eid
	@param {Object} props
	@param {Boolean} async
	@returns {jqXHR}
	###
	update_entry: (eid, props, async=true) ->
		url = @build_url 'daily', 'update', String(eid)
		ajax_opts = $.extend @ajax_defaults, type: 'POST', async: async, data: props
		$.ajax url, ajax_opts

window.Harvest = Harvest
