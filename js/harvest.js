/**
 * Harvest API Interface
 * by Mike Green
 *
 * MIT License
 */

// Harvest needs the day of the year for daily timesheet fetching
Date.prototype.getDOY = function() {
	var janOne = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((this - janOne) / 86400000);
};

/**
 * Harvest API Class
 */
function Harvest(subdomain, authString) {
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
		headers: {
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
	 * Get all timesheet entries (and project list)
	 * for a given day.
	 *
	 * @param {Date} date
	 * @param {Function} callback
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.getDay = function(date, callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		var dayURL = (date == 'today') ? root.buildURL('daily') : root.buildURL('daily', date.getDOY(), date.getFullYear());
		var request = $.ajax({
			url: dayURL
			, type: 'GET'
			, async: async
		}).complete(callback);
		return request;
	};

	/**
	 * Convenience method for getting today's entries
	 *
	 * @param {Function} callback
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.getToday = function(callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		root.getDay('today', callback, async);
	};
	
	/**
	 * Get an individual timer by ID
	 *
	 * @param {Number} eid
	 * @param {Function} callback
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.getEntry = function(eid, callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'show', eid);
		$.ajax({
			url: url
			, type: 'GET'
			, async: async
			, contentType: 'application/json'
			, authString: opts.authString
		}).complete(callback);
	};

	/**
	 * Toggle a single timer on/off
	 *
	 * @param {Number} eid
	 * @param {Function} callback
	 * @param {Boolean} async
	 * @returns {jqXHR}
	 */
	this.toggleTimer = function(eid, callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'timer', String(eid));
		$.ajax({
			url: url
			, type: 'GET'
			, async: async
			, contentType: 'application/json'
			, authString: opts.authString
		}).complete(callback);	
	};
	
	// Create a new entry, optionally starting its timer upon creation
	this.addEntry = function(props, callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'add')
			, json = JSON.stringify(props);

		$.ajax({
			url: url
			, type: 'POST'
			, async: async
			, contentType: 'application/json'
			, data: json
			, authString: opts.authString
		}).complete(callback);
	};

	// Delete an entry
	this.deleteEntry = function(eid, callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url = root.buildURL('daily', 'delete', eid);
		$.ajax({
			url: url
			, type: 'DELETE'
			, contentType: 'application/json'
			, authString: opts.authString
		}).complete(callback);
	};

	this.updateEntry = function(eid, props, callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		var url  = root.buildURL('daily', 'update', eid)
			, json = JSON.stringify(props);

		$.ajax({
			url: url
			, type: 'POST'
			, async: async
			, contentType: 'application/json'
			, data: json
			, authString: opts.authString
		}).complete(callback);
	};
}

// vim: set ts=2 sw=2 syntax=jquery smartindent :
