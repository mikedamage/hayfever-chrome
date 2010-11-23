$(document).ready(function() {
	var bgPage = chrome.extension.getBackgroundPage();
	$.each(bgPage.application.todaysEntries, function() {
		if (this.hours) {
			$('.noentries').remove();
		}
	});
});
