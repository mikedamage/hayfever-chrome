/*!
 * Hayfever for Chrome
 * Popup Script
 *
 * by Mike Green
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

		if (remote === true) { app.refreshHours(); }
		$timesheet.find('tr').remove();
		$('#entry-row-template').tmpl(app.todaysEntries).appendTo($timesheet);

		// Set big clocks in footer
		var totalHoursTime = app.totalHours.toClockTime()
			, currentHoursTime = app.currentHours.toClockTime();
		$('#total-hours-time').text(totalHoursTime);
		$('#current-hours-time').text(currentHoursTime);
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
	
	if (!app.authDataExists()) {
		$('tr.noentries').html('<td colspan="3" align="center"><div class="notice">Please visit the <a href="options.html" target="_blank">Options page</a> and configure Hayfever. Follow the link or click on the gear icon below to access the options page.</div></td>');
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
	
	// Harvest App Link

	// Add event listener for closed tabs (just look for the Harvest app tab)
	chrome.tabs.onRemoved.addListener(function(tabID) {
		if (tabID == app.harvestTab.id) {
			delete app.harvestTab;
		}
	});

	// "Open Harvest" link
	$('a#harvest-link').click(function() {
		if (app.harvestTab) {
			chrome.tabs.update(app.harvestTab.id, { selected: true });
		} else {
			chrome.tabs.create({
				url: 'https://' + app.getAuthData().subdomain + '.harvestapp.com'
				, selected: true
			}, function(tab) {
				app.harvestTab = tab;
			});
		}
		return false;
	});
	
	// Manual refresh
	$('a#refresh').refreshTimesheetOn('click', true);

	// Auto refresh - poll background page every 36 seconds for updates
	$timesheet.everyTime(36000, function() {
		$.refreshTimesheet();
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
		var $link = $(this)
			, timerID = parseInt($link.attr('data-timerid'), 10)
			, bgPage = chrome.extension.getBackgroundPage()
			, app = bgPage.application
			, toggleResult = app.client.toggleTimer(timerID);
		
		toggleResult.success(function(json) {
			if (json.timer_started_at) {
				var $activeImg = $('<img/>', {
					'src': 'img/progress.gif'
					, 'id': 'active-timer-img'
					, 'alt': 'Timer Running'
					, 'css': {
						display: 'none'
					}
				});

				bgPage.console.log('timer started: ' + json.project_id);
				$link.text('Stop');
				$activeImg.prependTo($link.parent().siblings('.entry-hours')).fadeIn(250);
			} else {
				bgPage.console.log('timer stopped');
				$link.text('Start');
				$('#active-timer-img').fadeOut(250, function() { $(this).remove(); });
			}
		});
		
		return false;
	}).delegate('a.edit', 'click', function(e) {
		// Timer edit handler
		var $link = $(this)
			, $overlay = $('#form-overlay')
			, $form = $('#entry-form')
			, timerID = $link.attr('data-timerid')
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
			, timerID = $link.attr('data-timerid')
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
