$(document).ready(function() {
	// Setup
	var bgPage = chrome.extension.getBackgroundPage()
		, dayEntries = bgPage.application.todaysEntries
		, $timesheet = $('#timesheet tbody');

	// Populate table with current timesheet entries for the current day
	if (dayEntries.length > 0) {
		$timesheet.find('.noentries').remove();
		$('#entry-row-template').tmpl(dayEntries).appendTo($timesheet);
	}

	// Add hidden 'new entry' form
	bgPage.application.client.getToday(function(xhr, txt) {
		var json = JSON.parse(xhr.responseText);
		if (json.projects) {
			// TODO: Build data structures to represent optgroups, with all projects grouped by client inside. Each project will contain an array of tasks
		} else {
			bgPage.console.log('Error fetching projects');
		}
	});

	
	// Events

	$('a#refresh').click(function(e) {
		bgPage.application.refreshHours;
		$timesheet.find('tr').animate({height: 'toggle', opacity: 'toggle'}, 350, function() {
			$(this).remove();
			$('#entry-row-template').tmpl(bgPage.application.todaysEntries).appendTo($timesheet);
		})
	});

	$('td.entry-toggle').delegate('a', 'click', function(e) {
		var entryID = parseInt($(this).attr('id').split('_')[1], 10)
			, $link = $(this)
			, bgPage = chrome.extension.getBackgroundPage();
		
		bgPage.application.client.toggleTimer(entryID, function(xhr, txt) {
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
