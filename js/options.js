$(document).ready(function() {
	var $subdomainField = $('#harvest-subdomain')
		, $usernameField = $('#harvest-username')
		, $passwordField = $('#harvest-password')
		, subdomain = localStorage['harvest_subdomain']
		, username = localStorage['harvest_username']
		, authString = localStorage['harvest_auth_string'];

	// Populate Fields if options are already set
	if (subdomain) {
		$subdomainField.val(subdomain);
	}
	if (username) {
		$usernameField.val(username);
	}

	// TODO: Don't store password in production version. Just store base64 encoded auth string and tell user that their password is saved.
	if (authString) {
		$('#harvest-password').next('.hint').html("We've successfully used your password to build an authentication string. This field will remain blank because we don't actually store your password. You can enter a new password at any time to rebuild the authentication string.");
	}

	$('#options').submit(function() {
		if ($subdomainField.val().length > 0) {
			localStorage['harvest_subdomain'] = $subdomainField.val();
		}
		if ($usernameField.val().length > 0) {
			localStorage['harvest_username'] = $usernameField.val();
		}
		if ($passwordField.val().length > 0) {
			var tempPassword = $passwordField.val();
		}

		if (localStorage['harvest_username'] && tempPassword) {
			var b64AuthString = btoa(localStorage['harvest_username'] + ':' + tempPassword);
			localStorage['harvest_auth_string'] = b64AuthString;
		}

		$('#status').addClass('success').html('Options successfully saved').fadeIn(400);
		return false;
	});
});

// vim: set ts=2 sw=2 syntax=jquery
