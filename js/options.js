/*!
 * Hayfever for Chrome
 * Options Page JavaScript
 *
 * by Mike Green (mike.is.green@gmail.com)
 *
 * Released under the terms of the GNU GPLv2. See LICENSE for details.
 */

/**
 * These are the things Hayfever stores in localStorage. (each root item is a property of localStorage).
 *   Ex. localStorage['harvest_subdomain'] //=> 'fo'
 *
 *   {
 *     'harvest_subdomain': 'foo',
 *     'harvest_username': 'foo@bar.com',
 *     'harvest_auth_string': 'Zm9vQGJhci5jb206Zm9vYmFyMTIz',
 *     'hayfever_prefs': {
 *       'enable_analytics': true,
 *       'badge_display': 'total',
 *       'badge_format': 'clock',
 *       'badge_color': '#108fbc',
 *       'show_task_notes': false
 *     }
 *   }
 */

;(function($) {
	$.fn.selectOption = function(name) {
		this.find('option[value="' + name + '"]').attr('selected', 'selected');
		return this;
	};
})(jQuery);

$(document).ready(function() {
	var $subdomainField = $('#harvest-subdomain')
		, $usernameField = $('#harvest-username')
		, $passwordField = $('#harvest-password')
		, $formFields = $('input[type!="submit"], select')
		, subdomain = localStorage['harvest_subdomain']
		, username = localStorage['harvest_username']
		, authString = localStorage['harvest_auth_string']
		, pluginPrefs = localStorage['hayfever_prefs']
		, bgPage = chrome.extension.getBackgroundPage();

	var colorPicker = $.farbtastic('#badge-color-picker', function(color) {
		$('#badge-color').val(color).css('background-color', color);
	});
	
	/**
 	 * Populate form fields if options are already set
	 */
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

		if (preferences.hasOwnProperty('badge_display')) {
			$('#badge-display').selectOption(preferences.badge_display);
		}

		if (preferences.hasOwnProperty('badge_format')) {
			$('#badge-format').selectOption(preferences.badge_format);
		}

		if (preferences.hasOwnProperty('badge_color')) {
			$('#badge-color').val(preferences.badge_color);
			colorPicker.setColor(preferences.badge_color);
		}

		if (preferences.hasOwnProperty('show_task_notes')) {
			$('#show-task-notes').attr('checked', 'checked');
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
				case 'show_task_notes':
					if ($(this).is(':checked')) {
						prefs.show_task_notes = true;
					} else {
						prefs.show_task_notes = false;
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

		if (!prefs.hasOwnProperty('show_task_notes')) {
			prefs.show_task_notes = false;
		}

		localStorage.setItem('hayfever_prefs', JSON.stringify(prefs));

		$('#status').addClass('success').html('Options successfully saved').fadeIn(400);

		bgPage.location.reload(); // Kludge: refresh the background page
		if (!bgPage.application.refreshInterval) {
			bgPage.application.startRefreshInterval();
		}
		return false;
	});
});

// vim: set ts=2 sw=2 syntax=jquery :
