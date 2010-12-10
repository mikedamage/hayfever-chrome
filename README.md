# Hayfever for Harvest

_A Google Chrome plugin for managing Harvest timers_

Copyright &copy; Mike Green (mike.is.green AT gmail DOT com)

## Summary

Hayfever is a plugin for Google Chrome that lets you manage your [Harvest](http://www.getharvest.com) timers and timesheets.

__The plugin is still under heavy development. Install at your own risk. Nothing is stable at this point, but I'll maintain a list below of stuff it can currently do.__

### Stuff Hayfever Can Do

Hayfever can currently:

* Authenticate w/ Harvest time tracking API
* Display a badge with total hours worked today
* Display a list of existing timers
* Start and stop existing timers
* Create new timers
* Edit and update existing timers

## Installation Instructions

If you've read through all the disclaimers and still wanna give Hayfever a try in its current raw state - that's great! I use it every day in my work and thus far it works pretty well. Once I've prettied it up and done some more testing, I'll release it on the Chrome Extensions Gallery. But for now you can download a .crx package, bundled by yours truly.

1. Click the downloads link above and grab the most recent CRX file.
2. Open it in Chrome.
3. Go to `chrome://extensions` and hit up Hayfever's options page. Add your Harvest subdomain, username, and password. _Note: Hayfever doesn't store your password. It just uses it to build an auth string, then it throws it away._
4. Use Hayfever!

## Screenshots

![Hayfever Hours Badge](http://s3.fifthroomcreative.com/mikedamage/hayfever-badge.png)
Hayfever Hours Badge

![Hayfever Popup Timesheet](http://s3.fifthroomcreative.com/mikedamage/hayfever-popup.png)
Hayfever Popup Timesheet

## License

This extension is released according to the terms of the MIT License. See [LICENSE](https://github.com/mikedamage/hayfever-chrome/blob/master/LICENSE) for details.
