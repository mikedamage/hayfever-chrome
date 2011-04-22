/*!
 * Hayfever for Chrome Website
 * Main JavaScript
 */

$(document).ready(function() {
	
	/**
 	 * Initialize Handlebars.js Templates
	 */
	
	Handlebars.registerHelper('debug', function(optionalVal) {
		console.log("Current Context: ");
		console.log(this);

		if (optionalVal) {
			console.log("Value:");
			console.log(optionalVal);
		}
	});
	
	/**
 	 * Subscribe Form Placeholders and HTML5 Inputs
	 * Regressive Enhancement - Most visitors use Chrome, but we'll downgrade the form if they don't.
	 */
	if (!Modernizr.inputtypes.email) {
		var $oldEmail = $('#subscribe-email')
			, $newEmail = $('<input/>', {
				name: $oldEmail.attr('name')
				, type: 'text'
				, id: $oldEmail.attr('id')
				, placeholder: 'Email'
			});
		$oldEmail.after($newEmail);
		$oldEmail.remove();
	}

	if (!Modernizr.input.placeholder) {
		$('#subscribe-form input[type!="hidden"]').each(function() {
			//$(this).before($('<label/>', {'for': $(this).attr('id'), 'text': $(this).attr('placeholder')}));
			var placeholder = $(this).attr('placeholder');

			$(this).val(placeholder).addClass('placeholder');

			$(this).focus(function() {
				var value = $(this).val();
				if (value == placeholder) {
					$(this).val('').removeClass('placeholder');
				}
			}).blur(function() {
				var value = $(this).val();
				if (value == '') {
					$(this).val(placeholder).addClass('placeholder');
				}
			});
		});
	}

	/**
 	 * Detect the #subscribed hash URI and record user subscription status in localStorage.
	 */
	if (window.location.hash && window.location.hash == '#subscribed') {
		var $thanks = $('#tmpl-thanks').html();
		$('#subscribe-form').fadeOut(400, function() {
			$('.subscribe').append($thanks);
		});
	} else if (window.location.href.match(/\#subscribed$/)){
		var $thanks = $('#tmpl-thanks').html();
		$('#subscribe-form').fadeOut(400, function() {
			$('.subscribe').append($thanks);
		});
	}

	$('.reset-form').live('click', function() {
		$('.thanks').fadeOut(400, function() {
			$(this).remove();
			$('#subscribe-form').fadeIn(400);
		});
		return false;
	});


}); 

// vim: set ts=2 sw=2 syntax=jquery :
