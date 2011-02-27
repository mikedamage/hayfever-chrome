$(document).ready(function() {
	var $subdomainField = $('#harvest-subdomain')
		, $usernameField = $('#harvest-username')
		, $passwordField = $('#harvest-password')
		, $formFields = $('input[type!="submit"]')
		, subdomain = localStorage['harvest_subdomain']
		, username = localStorage['harvest_username']
		, authString = localStorage['harvest_auth_string']
		, pluginPrefs = localStorage['hayfever_prefs']
		, bgPage = chrome.extension.getBackgroundPage();

	// Populate Fields if options are already set
	if (subdomain) {
		$subdomainField.val(subdomain);
	}
	if (username) {
		$usernameField.val(username);
	}

	if (authString) {
		$('#harvest-password').next('.hint').html("We've successfully used your password to build an authentication string. This field will remain blank because we don't actually store your password. You can enter a new password at any time to rebuild the authentication string.");
	}

	if (pluginPrefs) {
		var preferences = JSON.parse(pluginPrefs);

		if (preferences.hasOwnProperty('enable_analytics') && preferences.enable_analytics) {
			$('#enable-analytics').attr('checked', 'checked');
		}
	}

	$('#options').submit(function() {
		
		var prefs = {}, tempPassword;

		$formFields.each(function() {
			var fieldName = $(this).attr('name')
				, fieldVal = $(this).val();

			switch (fieldName) {
				case 'harvest_subdomain':
					/*jsl:fallthru*/
				case 'harvest_username':
					if (fieldVal.length > 0) {
						localStorage.setItem(fieldName, fieldVal);
					}
				break;
				case 'harvest_password':
					tempPassword = fieldVal;
				break;
				case 'enable_analytics':
					if ($(this).is(':checked')) {
						prefs.enable_analytics = true;
					} else {
						prefs.enable_analytics = false;
					}
				break;
				default:
					prefs[fieldName] = fieldVal;
			}
		});

		if (localStorage['harvest_username'] && tempPassword) {
			var b64AuthString = btoa(localStorage['harvest_username'] + ':' + tempPassword);
			localStorage.setItem('harvest_auth_string', b64AuthString);
		}

		if (!prefs.hasOwnProperty('enable_analytics')) {
			prefs.enable_analytics = false;
		}

		localStorage.setItem('hayfever_prefs', JSON.stringify(prefs));

		$('#status').addClass('success').html('Options successfully saved').fadeIn(400);

		if (!bgPage.application.refreshInterval) {
			bgPage.location.reload(); // Kludge: refresh the background page
			bgPage.application.startRefreshInterval();
		}
		return false;
	});
});

// vim: set ts=2 sw=2 syntax=jquery :
