/*!
 * Hayfever for Chrome Website
 * Main JavaScript
 */

$(document).ready(function() {
	
	/**
 	 * Initialize jQuery Templates
	 */
	
	$('#tmpl-github-feed-item').template('gitFeedItem');
	$('#tmpl-twitter-feed-item').template('twitterFeedItem');

	// GitHub Feed
	var githubFeed = $.getJSON('http://github.com/api/v2/json/commits/list/mikedamage/hayfever-chrome/master?callback=?', function(json) {
		if ('commits' in json) {
			var commits = json.commits
				, $commitList = $('#github-feed');

			$commitList.find('.loading').remove();

			for (var i=0; i < 3; i++) {
				var c          = json.commits[i]
					, shortHash  = c.id.substring(0, 12) + '...'
					, commitInfo = {
						hash: shortHash
						, date: new Date(c.committed_date)
						, message: c.message
						, url: c.url
					};
				
				$commitList.append($.tmpl('gitFeedItem', commitInfo));
			}

			$commitList.append('<li class="more"><a href="https://github.com/mikedamage/hayfever-chrome/commits/master" target="_blank">More &raquo;</a></li>');
		}
	});

}); 

// vim: set ts=2 sw=2 syntax=jquery :
