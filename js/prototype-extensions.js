/*!
 * JavaScript Prototype Extensions
 */

/**
 * Convert string to slug
 */
String.prototype.toSlug = function() {
	var slug = this.replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().replace(/\s/g, '_');
	return slug;
};

/**
 * Convert decimal time to clock time (sexagesimal)
 */
Number.prototype.toClockTime = function() {
	if (this == 0) {
		return '0:00';
	}
	var stringVal = this.toFixed(2)
		, decimalSplit = stringVal.split('.')
		, hours = parseInt(decimalSplit[0], 10)
		, minutes = parseFloat('0.' + decimalSplit[1]);
	
	minutes = parseInt((minutes * 60), 10);

	if (minutes < 10) {
		return hours + ':0' + minutes;
	} else {
		return hours + ':' + minutes;
	}
};

/**
 * Date prototype method: format the date so Harvest can understand it
 */
Date.prototype.toHarvestString = function() {
	var arr = this.toDateString().split(' ');
	return arr[0] + ', ' + arr[2] + ' ' + arr[1] + ' ' + arr[3];
};

/**
 * Array prototype method: any (like Ruby's Array#any? method)
 */
Array.prototype.any = function() {
	return this.length > 0;
};

// Harvest needs the day of the year for daily timesheet fetching
Date.prototype.getDOY = function() {
	var janOne = new Date(this.getFullYear(), 0, 1);
	return Math.ceil((this - janOne) / 86400000);
};

// vim: set ts=2 sw=2 syntax=jquery :
