/*!
 * Hayfever for Chrome
 * Popup Script
 *
 * by Mike Green
 * 
 * Released under the terms of the GNU GPLv2. See LICENSE for details.
 */

/**
 * jQuery Extension Functions
 */
;(function() {
	$.showStatus = function(opts) {
		var config = $.extend($.showStatus.defaults, opts)
			, $elem = $(config.selector);
			
		// Show status div, auto-hide in 10 seconds.
		$elem.attr('class', config.status).text(config.message).show().oneTime(6000, function() {
			$.hideStatus();
		});
	};

	$.hideStatus = function(elem) {
		var $statusDiv = ($.type(elem) == 'undefined') ? $('#status') : $(elem);
		$statusDiv.fadeOut(400);
	};

	$.showStatus.defaults = {
		selector: '#status'
		, message: ''
		, status: 'info'
	};
	
	$.fn.showIfHidden = function() {
		if ($(this).is(':not(:visible)')) {
			$(this).show();
		}
	};

	$.fn.showAndGrow = function(duration, elem) {
		var $elem = (typeof elem == 'undefined') ? $('#entry-form') : $(elem);
		$(this).fadeIn(duration, function() {
			var formHeight = $elem.height();
			$('body').animate({height: (formHeight + 30) + 'px'}, duration);
		});
	};

	// Refresh the timesheet w/ data from background page. Pass true to also refresh the background page's data.
	$.refreshTimesheet = function(remote) {
		var bg = chrome.extension.getBackgroundPage()
			, app = bg.application
			, $timesheet = $('#timesheet tbody');

		//if (remote) { app.refreshHours(); }
		/*
		$timesheet.find('tr').each(function() {
			$(this).remove();
		}).end().oneTime(100, function() {
			$(this).html($('#entry-row-template').tmpl(app.todaysEntries));
		});
		*/

		// Force UI updates to happen after hours are refreshed
		// `this` is bound to app.todaysEntries
		app.refreshHours(function() {
			// Repopulate table rows
			if (this.length > 0) {
				$timesheet.html($('#entry-row-template').tmpl(this));
				console.log("Refreshed hours, printed to timesheet.");
			} else {
				console.log("Refreshed hours, nothing to print.");
			}

			// Set big clocks in footer
			var totalHoursTime = app.totalHours.toClockTime()
				, currentHoursTime = app.currentHours.toClockTime();
			$('#total-hours-time').text(totalHoursTime);
			$('#current-hours-time').text(currentHoursTime);
		});
		
	};

	$.fn.refreshTimesheetOn = function(evt, bg) {
		var evtName = (typeof evt == 'undefined' || typeof evt != 'string') ? 'click' : evt;

		$(this).bind(evtName, function() {
			$.refreshTimesheet(bg);
		});
	};
})(jQuery);

$(document).ready(function() {
	// Setup
	var bgPage = chrome.extension.getBackgroundPage()
		, app = bgPage.application
		, dayEntries = app.todaysEntries
		, $timesheet = $('#timesheet tbody');
	
	window.preferences = app.getPreferences();
	
	if (!app.authDataExists()) {
		$('tr.noentries').html('<td colspan="3" align="center"><div class="notice">Please visit the <a href="options.html" target="_blank">Options page</a> and configure Hayfever. Follow the link or click on the gear icon below to access the options page.</div></td>');
	}

	if (!app.authorized) {
		$('tr.noentries').html('<td colspan="3" align="center"><div class="notice">Your Harvest authentication information is incorrect. Please visit the <a href="options.html" target="_blank">Options page</a> and correct your subdomain, username, and password.</div></tr>');
	}

	if (app.authorized) {
		var harvestSubdomain = app.getAuthData().subdomain;
		$('#harvest-link').attr('href', 'https://' + harvestSubdomain + '.harvestapp.com');
	}
	
	// Repaint the table rows whenever new elements are appended to the timesheet
	$timesheet.bind('DOMNodeInserted', function(evt) {
		$timesheet.find('tr:even').addClass('even').end().find('tr:odd').addClass('odd');
	});
	
	// Populate table with current timesheet entries for the current day
	if (dayEntries.length > 0) {
		$timesheet.find('.noentries').remove();
		$('#entry-row-template').tmpl(dayEntries).appendTo($timesheet);
		$timesheet.find('tr:even').addClass('even').end().find('tr:odd').addClass('odd');

		$('#total-hours-time').text(app.totalHours.toClockTime());
		$('#current-hours-time').text(app.totalHours.toClockTime());
	}

	// Events
	
	// Refresh timesheet when popup opens
	$.refreshTimesheet();
	
	// Manual refresh
	$('a#refresh').refreshTimesheetOn('click', true);

	// Auto refresh - poll background page every 36 seconds for updates
	$timesheet.everyTime(36000, function() {
		$.refreshTimesheet(true);
	});

	// New Entry link
	$('#new-entry-link').click(function(e) {
		var $form = $('#entry-form')
			, $overlay = $('#form-overlay');
		$form
			.find('h2')
				.text('New Entry')
			.end()
			.find('#timer-id')
				.remove()
			.end()
			.get(0)
				.reset();
		
		if ($('body').height() < 300) {
			$('body').data('oldHeight', $('body').height());
		} else {
			$('body').removeData('oldHeight');
		}

		$overlay.showAndGrow(300);
		return false;
	});

	// Close form link
	$('a.cancel').click(function() {
		var $overlay = $('#form-overlay');

		if ($('body').data('oldHeight')) {
			$('body').animate({height: $('body').data('oldHeight') + 'px'}, 300);
		}

		$overlay.fadeOut(300);

		//$form.removeClass('visible');
	});
	

	$timesheet.delegate('a.toggle', 'click', function(e) {
		// Timer toggle handler
		var $link        = $(this)
			, $tableRow    = $link.closest('tr')
			, timerID      = parseInt($link.data('timerId'), 10)
			, bgPage       = chrome.extension.getBackgroundPage()
			, app          = bgPage.application
			, toggleResult = app.client.toggleTimer(timerID);
		
		toggleResult.success(function(json) {
			if (json.timer_started_at) {
				bgPage.console.log('timer started: ' + json.id + ', project_id: ' + json.project_id + ', task_id: ' + json.task_id);
				$tableRow.addClass('running');
			} else {
				bgPage.console.log('timer stopped: ' + json.id + ', project_id: ' + json.project_id + ', task_id: ' + json.task_id);
				$tableRow.removeClass('running');
			}
		});
		
		return false;
	}).delegate('a.edit', 'click', function(e) {
		// Timer edit handler
		var $link = $(this)
			, $overlay = $('#form-overlay')
			, $form = $('#entry-form')
			, timerID = $link.data('timerId')
			, $input = $('<input/>', {'id': 'timer-id', type: 'hidden', 'value': timerID })
			, bgPage = chrome.extension.getBackgroundPage()
			, app = bgPage.application;
		
		// append hidden field to form w/ this timer's ID
		$form.find('h2').text('Edit Entry').end().append($input);

		// fetch timer data from Harvest
		var entryFetch = app.client.getEntry(timerID);
		entryFetch.success(function(json) {
			// populate form fields with the entry's values:
			// iterate thru the client options and select the one that belongs to this timer
			$form.find('#client-select option').each(function() {
				if ($(this).val() == json.project_id) {
					$(this).attr('selected', 'selected');
					$('#client-select').change();
					return false; // break loop
				}
			});

			// same deal for task option tags
			$form.find('#task-select option').each(function() {
				if ($(this).val() == json.task_id) {
					$(this).attr('selected', 'selected');
					return false; // break loop
				}
			});

			// hours and notes fields
			$form.find('#task-hours').val(json.hours).end().find('#task-notes').val(json.notes);
			
			$overlay.showAndGrow(300);
		});

		return false;
	}).delegate('a.delete', 'click', function() {
		var $link = $(this)
			, timerID = $link.data('timerId')
			, bgPage = chrome.extension.getBackgroundPage()
			, app = bgPage.application;

		var deleteEntry = app.client.deleteEntry(timerID);
		deleteEntry.complete(function(xhr) {
			var stat = xhr.status;

			if (stat == 200) {
				app.refreshHours();
				$.showStatus({status: 'success', message: 'Entry deleted'});
				$('a#refresh').click();
			} else {
				bgPage.console.log("Error deleting entry! API returned status " + stat);
			}
		});
	}).delegate('tr.entry', 'dblclick', function() {
		// Double click a row to edit its timer
		$(this).find('td.entry-toggle a.edit').click();
	});
	
	// loop thru the TaffyDB object and create optgroup tags for each client, option tags for each project	
	app.projectDB.forEach(function(p, i) {
		var $select = $('#client-select')
			, clientSlug = p.client.toSlug()
			, $optgroup = $select.find('.' + clientSlug);
		
		if ($optgroup.size() == 0) {
			$select.append($('<optgroup/>', {
				'label': p.client
					, 'class': clientSlug
			}));
			$optgroup = $select.find('.' + clientSlug);
		}
		
		$('#client-project-option-tag').tmpl(p).appendTo($optgroup);
	});

	// When user selects a project, populate the tasks selector with that project's tasks
	$('#client-select').change(function() {
		var $option = $(this).find('option:selected')
			, $taskSelect = $('#task-select')
			, $billable = $taskSelect.find('optgroup.billable')
			, $notBillable = $taskSelect.find('optgroup.not-billable')
			, val = $(this).val()
			, tasks = app.projectDB.first({id: val}).tasks;
		
		// clear all options from the task selector, except the first
		$taskSelect.find('option:not(.no-selection)').remove();
		
		// Append each of the selected project's tasks to the task selector	
		$.each(tasks, function() {
			var opt = $('<option/>', {
				'class': 'task-' + this.id
				, value: this.id
				, text: this.name
			});

			if (this.billable) {
				opt.appendTo($billable);
			} else {
				opt.appendTo($notBillable);
			}
		});

		// return true or else...
		return true;
	});
	
	// Handle entry form submissions
	$('#entry-form').submit(function() {
		var today = new Date()
			, $overlay = $(this).closest('#form-overlay')
			, $idField = $(this).find('#timer-id')
			, props = {
				notes: $('#task-notes').val()
				, hours: $('#task-hours').val()
				, project_id: $('#client-select').val()
				, task_id: $('#task-select').val()
				, spent_at: today.toHarvestString()
			}
			, autoStart = $('#start-on-save').is(':checked');
		
		if ($idField.size() > 0) {
			var timerID = $idField.val();
			var updateResult = app.client.updateEntry(timerID, props);

			updateResult.success(function(json, status, xhr) {
				$('#entry-form').find('h2').text('New Entry').end().get(0).reset();
				$idField.remove();
				$('#task-select option:not(.no-selection)').remove();

				if (xhr.status == 200) {
					// Successful Update
					$.showStatus({message: "Entry updated!", status: 'success'});
					
					// Auto-start timer if box is checked
					if (autoStart) {
						timerID = json.id;
						console.log('toggling timer ' + timerID);
						app.client.toggleTimer(timerID);
					}

					$.refreshTimesheet(true);
				} else {
					// Error
					$('#status').attr('class', '').addClass('error').text('Error updating entry!');
				}
			});
		} else {
			var addResult = app.client.addEntry(props);
			addResult.success(function(json, status, xhr) {
				if (xhr.status == 201) {
					// Clear the form
					$('#entry-form').get(0).reset();
					$('#task-select option:not(.no-selection)').remove();

					// Print a message to the status div
					$.showStatus({status: 'success', message: 'New entry successfully created!'});

					if (autoStart && !_(props.hours).isEmpty()) {
						var timerID = js.id
							, alreadyRunning = js.hasOwnProperty('timer_started_at');

						if (_(timerID).isNumber() && !alreadyRunning) {
							console.log('toggling timer ' + timerID);
							app.client.toggleTimer(timerID);
						}
					}

					bgPage.application.refreshHours();
					$('a#refresh').click();
				} else {
					$.showStatus({status: 'error', message: 'Error saving entry!'});
				}
			});
		}
		
		$overlay.fadeOut(300, function() {
			if ($('body').data('oldHeight')) {
				$('body').animate({height: $('body').data('oldHeight') + 'px'}, 300);
			}
		});

		// prevent synchronous submission
		return false;
	});
});

// vim: set ts=2 sw=2 syntax=jquery smartindent :
