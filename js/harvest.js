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

// DRY up the process of setting request headers for API calls
XMLHttpRequest.prototype.setHarvestHeaders = function(authString) {
	this.setRequestHeader('Accept', 'application/json');
	this.setRequestHeader('Content-type', 'application/json');
	this.setRequestHeader('Cache-Control', 'no-cache');
	this.setRequestHeader('Authorization', 'Basic ' + authString);
};

function Harvest(subdomain, authString) {
	var root = this
		, opts = {
			subdomain: subdomain
			, authString: authString
		}
		, fullURL = 'https://'+opts.subdomain+'.harvestapp.com';

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
	this.getDay = function(date, callback) {
		var dayURL = (date == 'today') ? (fullURL + '/daily') : (fullURL + '/daily/' + date.getDOY() + '/' + date.getFullYear());
		$.ajax({
			url: dayURL
			, type: 'GET'
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});
	};

	// convenience method for getDay('today', callback)
	this.getToday = function(callback) {
		root.getDay('today', callback);
	};
	
	// Get an individual entry (timer) by ID
	this.getEntry = function(eid, callback) {
		var url = root.buildURL('daily', 'show', eid);
		$.ajax({
			url: url
			, type: 'GET'
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});
	};

	// Toggle a single timer
	this.toggleTimer = function(callback) {
		var url = root.buildURL('daily', 'timers', String(eid));
		$.ajax({
			url: url
			, type: 'GET'
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});	
	};
	
	// Create a new entry, optionally starting its timer upon creation
	this.addEntry = function(props, callback) {
		var url = root.buildURL('daily', 'add')
			, json = JSON.stringify({ request: properties });

		$.ajax({
			url: url
			, type: 'POST'
			, data: json
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});
	};

	// Delete an entry
	this.deleteEntry = function(eid, callback) {
		var url = root.buildURL('daily', 'delete', eid);
		$.ajax({
			url: url
			, type: 'DELETE'
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});
	};

	this.updateEntry = function(eid, props, callback) {
		var url  = root.buildURL('daily', 'update', eid)
			, json = JSON.stringify({ request: properties });

		$.ajax({
			url: url
			, type: 'POST'
			, data: json
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});
	};
}

// vim: set ts=2 sw=2 syntax=jquery smartindent :
