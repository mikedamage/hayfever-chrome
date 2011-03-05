// Initialize Preferences if none are found
var prefs = localStorage.getItem('hayfever_prefs');

if (!prefs || _(prefs).isEmpty()) {
	// Default plugin preferences
	prefs                  = {};
	prefs.badge_display    = 'total';
	prefs.badge_format     = 'decimal';
	prefs.badge_color      = '#8AC3FF';
	prefs.enable_analytics = false;
	localStorage.setItem('hayfever_prefs', JSON.stringify(prefs));
} else {
	prefs = JSON.parse(prefs);
	prefs.badge_display = (prefs.hasOwnProperty('badge_display') ? prefs.badge_display : 'total');
	prefs.badge_format = (prefs.hasOwnProperty('badge_format') ? prefs.badge_format : 'decimal');
	prefs.badge_color = (prefs.hasOwnProperty('badge_color') ? prefs.badge_color : '#8AC3FF');
	prefs.enable_analytics = (prefs.hasOwnProperty('enable_analytics') ? prefs.enable_analytics : false);
	
	localStorage.setItem('hayfever_prefs', JSON.stringify(prefs));
}
