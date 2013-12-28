chrome.storage.local.get('hayfever_prefs', function(prefs) {
	if (!_(prefs).isEmpty() && prefs.enable_analytics) {
		var _gaq = _gaq || [];
		_gaq.push(['_setAccount', 'UA-21680103-1']);
		_gaq.push(['_trackPageview']);

		(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = 'https://ssl.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		})();
	}
});
