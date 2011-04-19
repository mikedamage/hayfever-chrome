# Hayfever for Harvest

_A Google Chrome plugin for managing Harvest timers_

Copyright &copy; 2010, Mike Green (mike.is.green AT gmail DOT com)

[![Donate to the development of Hayfever](http://pledgie.com/campaigns/14742.png?skin_name=chrome)][1]

## Summary

Hayfever is a plugin for Google Chrome that lets you manage your [Harvest](http://www.getharvest.com) timers and timesheets.

Hayfever currently duplicates the feature set of the Harvest desktop widget, but I've got plans to extend its functionality far beyond that.

### Stuff Hayfever Can Do

Hayfever can currently:

* Authenticate w/ Harvest time tracking API
* Display a badge with total hours worked today
* Display a list of existing timers
* Start and stop existing timers
* Create new timers
* Edit and update existing timers

## Installation Instructions

Hayfever is available for download on the Chrome Web Store, for the low low price of $0. That's the preferred method for getting Hayfever, since you'll automatically get all future updates as soon as they're released.

[Get Hayfever from the Chrome Web Store](https://chrome.google.com/extensions/detail/hieiheiincjomjoiiknfcmiioakhlhmj)

### The DIY Method

I also bundle the extension up as a CRX file and post it here whenever I release an update. If you're the DIY type, you can grab it and install it the old fashioned way.

1. Click the downloads link above and grab the most recent CRX file.
2. Open it in Chrome.
3. Install it, then right-click on the Hayfever icon in your toolbar.
4. Fill in your Harvest subdomain, username, and password.
	* Please consider allowing me to gather usage statistics! I'm a privacy nut, so I turned this off by default, but it would definitely help me to understand my users.
5. Use Hayfever!

### The Hacker Method

If you're *REALLY* the DIY type, you can clone this repo and install it ninja-style. If that's your plan, you don't need me to tell you how to do it.

## Screenshots

![Hayfever Hours Badge](http://mikedamage.github.com/hayfever-chrome/img/screenshot-02.png)
![Hayfever Hours Badge: Red](http://mikedamage.github.com/hayfever-chrome/img/hours-badge-red.png)
![Hayfever Hours Badge: Blue](http://mikedamage.github.com/hayfever-chrome/img/hours-badge-blue.png)
Hayfever Hours Badge (omg colorz!)

![Hayfever Popup Timesheet](http://mikedamage.github.com/hayfever-chrome/img/screenshot-01.png)
Hayfever Popup Timesheet

## Usage Statistics

Hayfever gathers usage statistics via Google Analytics, but only if you decide to let it. Right now I do __not__ do any event tracking, so the only data I get is how many people use the plugin and how often.

Analytics are turned off by default because I believe it should be a matter of choice.

## License

![GNU General Public License v3](http://mikegreen.s3.amazonaws.com/projects/hayfever/gpl-logo-127x51.png)

This extension is released according to the terms of the GNU General Public License, version 3. See [LICENSE](https://github.com/mikedamage/hayfever-chrome/blob/master/LICENSE) for details.

[1]: http://www.pledgie.com/campaigns/14742
[2]: http://www.pledgie.com/campaigns/14742.png?skin_name=chrome
