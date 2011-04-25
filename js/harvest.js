/**
 * Harvest API Interface
 * by Mike Green
 *
 * # Summary
 * This library consumes the Harvest REST API. It currently depends on jQuery and Underscore.js,
 * and I have no plans on generalizing it any further. It might be a good starting point for anyone
 * looking to build a similar library for Node.js, etc.
 * 
 * Released under the terms of the GNU GPLv2. See LICENSE for details.
 */

/**
 * Harvest API Class
 */
function Harvest(subdomain, authString) {
	if (typeof subdomain === "undefined" || typeof authString === "undefined") {
		throw {error: "InvalidArguments", message: "Must include both a subdomain and auth string in constructor"};
	}
	var root = this
		, opts = {
			subdomain: subdomain
			, authString: authString
		}
		, fullURL = 'https://'+opts.subdomain+'.harvestapp.com';

	/**
	 * Set default AJAX options
	 *
	 * Harvest is very picky about headers. Simply setting dataType to 'json'
	 * will not produce the correct response from the Harvest API.
	 */	
	$.ajaxSetup({
		dataType: 'json'
		, headers: {
			'Accept': 'application/json'
			, 'Content-Type': 'application/json'
			, 'Cache-Control': 'no-cache'
			, 'Authorization': 'Basic ' + opts.authString 
		}
	});

	/**
	 * Getters & Setters
	 */
	this.getOpts = function() {
		return opts;
	};

	this.getSubdomain = function() {
		return opts.subdomain;
	};

	this.getFullURL = function() {
		return ('https://' + opts.subdomain + '.harvestapp.com');
	}

	this.getUsername = function() {
		return opts.username;
	};

	this.getAuthString = function() {
		return opts.authString;
	};

	this.setOpts = function(newOpts) {
		opts = newOpts;
		return opts;
	};

	this.setSubdomain = function(subdomain) {
		opts.subdomain = subdomain;
		return opts.subdomain;
	};

	this.setUsername = function(username) {
		opts.username = username;
		return username;
	};

	this.setAuthString = function(auth) {
		opts.authString = auth;
		return opts.authString;
	};

	this.get = function(prop) {
		if (prop in opts) {
			return opts[prop];
		} 
		return null;
	};

	this.set = function(prop, val) {
		opts[prop] = val;
		return val;
	};

	/**
	 * Build a URL for an API call
	 *
	 * @param {String[]} arguments
	 * @returns {String}
	 */
	this.buildURL = function() {
		var url = fullURL
			, argc = arguments.length;

		$.each(arguments, function(i, v) {
			url += '/' + v;
		});
		return url;
	};

	/**
	 * Get API rate limit status
	 *
	 * @returns {jqXHR}
	 */
	this.rateLimitStatus = function() {
		var statusURL = root.buildURL('account', 'rate_limit_status')
	 	, request = $.ajax({
			url: statusURL
			, type: 'GET'
		});

		return request;
	};
	
	/**
	 * Get all timesheet entries (and project list)
	 * for a given day.
	 *
	 * @param {Date} date
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.getDay = function(date, async) {
		async = (typeof async == 'undefined') ? true : async;
		var dayURL = (date == 'today') ? root.buildURL('daily') : root.buildURL('daily', date.getDOY(), date.getFullYear());
		var request = $.ajax({
			url: dayURL
			, type: 'GET'
			, async: async
		});

		return request; // Return promise object
	};

	/**
	 * Convenience method for getting today's entries
	 *
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.getToday = function(async) {
		async = (typeof async == 'undefined') ? true : async;
		return root.getDay('today', async);
	};
	
	/**
	 * Get an individual timer by ID
	 *
	 * @param {Number} eid
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.getEntry = function(eid, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'show', eid);
		var request = $.ajax({
			url: url
			, type: 'GET'
			, async: async
		});

		return request;
	};

	/**
	 * Find runaway timers from yesterday
	 *
	 * Grabs yesterday's timers and checks for timer_started_at properties
	 *
	 * @returns {Boolean}
	 */
	this.runawayTimers = function(async) {
		async = (typeof async == 'undefined') ? true : async;
		var today = new Date()
			, yesterday = today.yesterday()
			, request = root.getDay(yesterday, async);

		request.success(function(json) {
			if (json.hasOwnProperty('day_entries')) {
				var entries = json.day_entries;

				return _(entries).detect(function(entry) { return entry.hasOwnProperty('timer_started_at'); });
			} else {
				return false;
			}
		});
	};

	/**
	 * Toggle a single timer on/off
	 *
	 * @param {Number} eid
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.toggleTimer = function(eid, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'timer', String(eid));
		var request = $.ajax({
			url: url
			, type: 'GET'
			, async: async
		});	

		return request;
	};
	
	/**
	 * Create a new entry, optionally starting its timer upon creation
	 *
	 * @param {Object} props
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 *
	 * Expected properties:
	 *   - notes
	 *   - hours
	 *   - project_id
	 *   - task_id
	 *   - spent_at
	 */
	this.addEntry = function(props, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'add')
			, json = JSON.stringify(props);

		var request = $.ajax({
			url: url
			, type: 'POST'
			, async: async
			, data: json
		});

		return request;
	};

	// Delete an entry
	this.deleteEntry = function(eid, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'delete', eid);
		var request = $.ajax({
			url: url
			, type: 'DELETE'
		});

		return request;
	};

	this.updateEntry = function(eid, props, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url  = root.buildURL('daily', 'update', eid)
			, json = JSON.stringify(props);

		var request = $.ajax({
			url: url
			, type: 'POST'
			, async: async
			, data: json
		});

		return request;
	};
}

// vim: set ts=2 sw=2 syntax=jquery smartindent :
