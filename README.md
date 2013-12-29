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

### The Hacker Method

If you're *REALLY* the DIY type, you can clone this repo and install it ninja-style. You'll need to run a few commands to compile CSS, CoffeeScript, and package the extension as a zip file. You must have CoffeeScript and Bower installed and in your `PATH`.

```
# Install CoffeeScript and Bower if necessary:
$ npm install -g coffee-script bower

# Install dependencies and compile CSS + CoffeeScripts:
$ bundle install
$ bower install
$ thor project:build

# There's also a thor task for packaging the extension as a zip file inside the pkg/ folder:
$ thor project:zip_release
```

From there you can install the extension by enabling developer mode in chrome://extensions and loadng the `build` directory as an unpacked extension.

## Screenshots

![Hayfever Hours Badge](http://mikegreen.s3.amazonaws.com/projects/hayfever/screenshot-02.png)
![Hayfever Hours Badge: Red](http://mikegreen.s3.amazonaws.com/projects/hayfever/hours-badge-red.png)
![Hayfever Hours Badge: Blue](http://mikegreen.s3.amazonaws.com/projects/hayfever/hours-badge-blue.png)
Hayfever Hours Badge (omg colorz!)

![Hayfever Popup Timesheet](http://mikegreen.s3.amazonaws.com/projects/hayfever/screenshot-01.png)
Hayfever Popup Timesheet

## Usage Statistics

Hayfever gathers usage statistics via Google Analytics, but only if you decide to let it. Right now I do __not__ do any event tracking, so the only data I get is how many people use the plugin and how often.

Analytics are turned off by default because I believe it should be a matter of choice.

## License

This extension is released according to the terms of the GNU General Public License, version 2. See [LICENSE](https://github.com/mikedamage/hayfever-chrome/blob/master/LICENSE) for details.

[1]: http://www.pledgie.com/campaigns/14742
[2]: http://www.pledgie.com/campaigns/14742.png?skin_name=chrome
