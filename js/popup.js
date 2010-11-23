$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	$.each(bgPage.application.todaysEntries, function() {
		if (this.hours) {
			$('.noentries').remove();
		}
		$('#timesheet tbody').append('<tr><td>'+this.client+'</td><td>'+this.hours+'</td>');
	});
});
