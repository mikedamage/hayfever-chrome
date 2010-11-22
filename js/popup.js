$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	$.each(bgPage.application.todaysEntries, function() {
		$('#timesheet').append('<li>'+this.client+'</li>');
	});
});
