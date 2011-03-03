// Initialize Preferences if none are found
var prefs = localStorage.getItem('hayfever_prefs');

if (!prefs || _(prefs).isEmpty()) {
	// Default plugin preferences
	prefs                  = {};
	prefs.badge_display    = 'total';
	prefs.badge_format     = 'decimal';
	prefs.enable_analytics = false;
	localStorage.setItem('hayfever_prefs', JSON.stringify(prefs));
}
