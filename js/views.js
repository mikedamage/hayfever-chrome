/*
 * Initialize Views
 * Lovingly copied from Skeet http://github.com/presently/skeet
 */

var Views = {};

$.each(['entry', 'entry_form'], function() {
	var view_name = '/views/' + this + '.mustache';
	var view_url = chrome.extension.getURL(view_name);
	$.ajax({
		url: view_url
		, success: function(view) {
			Views[this] = view;
		}
		, error: function() {
			alert("Couldn't load view: " + view_name);
		}
		, async: false
	});
});
