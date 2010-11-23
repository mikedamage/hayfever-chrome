/*
 * Initialize Views
 * Lovingly copied from Skeet http://github.com/presently/skeet
 */

var Views = {};

$.each(['entry', 'entry_form'], function() {
	var view_name = this;
	$.ajax({
		url: 'views/' + view_name + '.mustache'
		, success: function(view) {
			Views[view_name] = view;
		}
		, error: function() {
			alert("Couldn't load view: " + view_name);
		}
		, async: false
	});
});
