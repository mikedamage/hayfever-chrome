$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage()
		, dayEntries = bgPage.application.todaysEntries
		, $timesheet = $('#timesheet');

	if (dayEntries.length > 0) {
		$timesheet.find('.noentries').remove();
		$('#entry-row-template').tmpl(dayEntries).appendTo($timesheet);
	}

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
