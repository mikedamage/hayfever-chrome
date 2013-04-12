# Initialize Preferences if none are found

prefs = localStorage.getItem 'hayfever_prefs'

if !prefs or _(prefs).isEmpty()
	prefs =
		badge_display: 'total'
		badge_format: 'decimal'
		badge_color: '#8AC3FF'
		enable_analytics: false
	localStorage.setItem 'hayfever_prefs', JSON.stringify(prefs)
else
	prefs = JSON.parse(prefs)
	prefs.badge_display ||= 'total'
	prefs.badge_format ||= 'decimal'
	prefs.badge_color ||= '#8AC3FF'
	prefs.enable_analytics = if prefs.hasOwnProperty('enable_analytics') then prefs.enable_analytics else false

	localStorage.setItem 'hayfever_prefs', JSON.stringify(prefs)
