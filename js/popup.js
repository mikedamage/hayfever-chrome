$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	$.each(bgPage.application.todaysEntries, function() {
		if (this.hours) {
			$('.noentries').remove();
			if (Views) {
				var row = Mustache.to_html(Views['entry'], this);
				$('#timesheet tbody').append(row);
			}
		}
	});
});
