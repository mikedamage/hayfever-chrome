$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	$.each(bgPage.application.todaysEntries, function() {
		if (this.hours) {
			$('.noentries').remove();
			$("#entry_row_template").tmpl(this).appendTo("#timesheet tbody");
		}
	});
});
