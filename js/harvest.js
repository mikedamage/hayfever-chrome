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
}

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

	this.getDay = function(date, callback) {
		var dayURL = (date == 'today') ? (fullURL + '/daily') : (fullURL + '/daily/' + date.getDOY() + '/' + date.getFullYear());
		$.ajax({
			url: dayURL
			, beforeSend: function(xhr) {
				xhr.setRequestHeader('Accept', 'application/json');
				xhr.setRequestHeader('Content-type', 'application/json');
				xhr.setRequestHeader('Authorization', 'Basic ' + opts.authString);
				xhr.setRequestHeader('Cache-Control', 'no-cache');
			}
			, complete: callback
		});
	};

	this.getToday = function(callback) {
		// convenience method for getDay('today', callback)
		root.getDay('today', callback);
	};
}

// vim: set ts=2 sw=2 syntax=jquery smartindent :
