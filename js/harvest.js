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
		,	opts = {
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

	this.buildURL = function() {
		var url = fullURL
			, argc = arguments.length;

		$.each(arguments, function(i, v) {
			url += '/' + v;
		});
		return url;
	};

	this.getDay = function(date, callback) {
		var dayURL = (date == 'today') ? (fullURL + '/daily') : (fullURL + '/daily/' + date.getDOY() + '/' + date.getFullYear());
		$.ajax({
			url: dayURL
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});
	};

	this.getToday = function(callback) {
		// convenience method for getDay('today', callback)
		root.getDay('today', callback);
	};

	this.getEntry = function(eid, callback) {
		var url = root.buildURL('daily', 'show', eid);
		$.ajax({
			url: url
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});
	};

	this.toggleTimer = function(callback) {
		var url = root.buildURL('daily', 'timers', String(eid));
		$.ajax({
			url: url
			, beforeSend: function(xhr) {
				xhr.setHarvestHeaders(opts.authString);
			}
			, complete: callback
		});	
	};
}

// vim: set ts=2 sw=2 syntax=jquery smartindent :
