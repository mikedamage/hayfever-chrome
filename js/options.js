$(document).ready(function() {
	var $subdomainField = $('#harvest-subdomain')
		, $usernameField = $('#harvest-username')
		, $passwordField = $('#harvest-password')
		, subdomain = localStorage['harvest_subdomain']
		, username = localStorage['harvest_username']
		, password = localStorage['harvest_password'];

	// Populate Fields if options are already set
	if (subdomain) {
		$subdomainField.val(subdomain);
	}
	if (username) {
		$usernameField.val(username);
	}

	// TODO: Don't store password in production version. Just store base64 encoded auth string and tell user that their password is saved.
	if (password) {
		$passwordField.val(password);
	}

	$('#options').submit(function() {
		if ($subdomainField.val().length > 0) {
			localStorage['harvest_subdomain'] = $subdomainField.val();
		}
		if ($usernameField.val().length > 0) {
			localStorage['harvest_username'] = $usernameField.val();
		}
		if ($passwordField.val().length > 0) {
			localStorage['harvest_password'] = $passwordField.val();
		}

		if (localStorage['harvest_username'] && localStorage['harvest_password']) {
			var b64AuthString = atob(localStorage['harvest_username'] + ':' + localStorage['harvest_password']);
		}

		$('#status').addClass('success').html('Options successfully saved');
		return false;
	});
});

// vim: set ts=2 sw=2 syntax=jquery
