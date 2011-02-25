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
	
	$.ajaxSetup({
		accepts: 'application/json'
		, contentType: 'application/json'
		, cache: false
		, beforeSend: function(jxhr) {
			jxhr.setRequestHeader('Authorization', 'Basic ' + opts.authString);
		}
	});

	$.ajaxPrefilter(function(jaxOpts, origOpts, jXHR) {
		jXHR.setRequestHeader('Authorization', 'Basic ' + jaxOpts.authString);
	});

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

	// Build a URL for an API call
	this.buildURL = function() {
		var url = fullURL
			, argc = arguments.length;

		$.each(arguments, function(i, v) {
			url += '/' + v;
		});
		return url;
	};
	
	// Get all entries for a given day
	this.getDay = function(date, callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		var dayURL = (date == 'today') ? root.buildURL('daily') : root.buildURL('daily', date.getDOY(), date.getFullYear());
		$.ajax({
			url: dayURL
			, type: 'GET'
			, async: async
			, contentType: 'application/json'
			, authString: opts.authString
		}).complete(callback);
	};

	// convenience method for getDay('today', callback)
	this.getToday = function(callback, async) {
		async = (typeof async == 'undefined') ? true : async;
		root.getDay('today', callback, async);
	};
	
	// Get an individual entry (timer) by ID
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

	// Toggle a single timer
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
