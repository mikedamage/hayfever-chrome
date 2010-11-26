$(document).ready(function() {
	// Setup
	var bgPage = chrome.extension.getBackgroundPage()
		, app = bgPage.application
		, dayEntries = app.todaysEntries
		, $timesheet = $('#timesheet tbody');
	
	if (!app.authDataExists()) {
		$('#header').after($('<div/>', {
			'class': 'notice'
			, text: 'Please visit the Options page and configure Hayfever'
		}));
	}
	// Populate table with current timesheet entries for the current day
	if (dayEntries.length > 0) {
		$timesheet.find('.noentries').remove();
		$('#entry-row-template').tmpl(dayEntries).appendTo($timesheet);
	}

	// Events

	$('a#refresh').click(function(e) {
		app.refreshHours();
		$timesheet.find('tr').animate({height: 'toggle', opacity: 'toggle'}, 350, function() {
			$(this).remove();
			$('#entry-row-template').tmpl(app.todaysEntries).appendTo($timesheet);
		})
	});

	$('td.entry-toggle').delegate('a', 'click', function(e) {
		var entryID = parseInt($(this).attr('id').split('_')[1], 10)
			, $link = $(this)
			, bgPage = chrome.extension.getBackgroundPage()
			, app = bgPage.application;
		
		app.client.toggleTimer(entryID, function(xhr, txt) {
			var js = JSON.parse(xhr.responseText);
			if (js.timer_started_at) {
				bgPage.console.log('timer started: ' + js.project_id);
				$link.text('Stop');
			} else {
				bgPage.console.log('timer stopped');
				$link.text('Start');
			}
		});
		
		return false;
	});
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
