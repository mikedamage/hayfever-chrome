function Harvest(subdomain, authString) {
	var opts = {
		subdomain: subdomain
		, authString: authString
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

	this.getToday = function(callback=function() {}) {
		var url = this.getFullURL();

		$.ajax({
			url: url + '/daily'
			, type: 'GET'
			, beforeSend: function(xhr) {
				xhr.setRequestHeader('Accept', 'application/json');
				xhr.setRequestHeader('Content-type', 'application/json');
				xhr.setRequestHeader('Authorization', 'Basic ' + opts.authString);
				xhr.setRequestHeader('Cache-Control', 'no-cache');
			}
			, complete: function(xhr, txtStatus) {
				if (txtStatus == '200') {
					var json = JSON.parse(xhr.responseText);
					callback.call(json);
				}
			}
		});
	};
}