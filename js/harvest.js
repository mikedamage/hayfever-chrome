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
		if ($.type(date) == 'date') {
			var first = new Date(date.getFullYear(), 0, 1)
					, dayNum = Math.round(((date - first) / 1000 / 60 / 60 / 24) + .5, 0);
		} else {
			throw 'getDay requires a Date object';
			return false;
		}
	};

	this.getToday = function(callback) {
		var json;

		$.ajax({
			url: fullURL + '/daily'
			, type: 'GET'
			, beforeSend: function(xhr) {
				xhr.setRequestHeader('Accept', 'application/json');
				xhr.setRequestHeader('Content-type', 'application/json');
				xhr.setRequestHeader('Authorization', 'Basic ' + opts.authString);
				xhr.setRequestHeader('Cache-Control', 'no-cache');
			}
			, complete: callback
		});
	};
}

// vim: set ts=2 sw=2 syntax=jquery smartindent :
