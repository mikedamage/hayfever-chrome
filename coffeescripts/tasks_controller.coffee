###
Angular.js Popup Tasks Controller
###

angular.module 'hayfeverApp', ['ui']

TasksController = ($scope) ->
	bg_page = chrome.extension.getBackgroundPage()
	bg_app = bg_page.application

	$scope.projects      = bg_app.projects
	$scope.clients       = bg_app.clients
	$scope.timers        = bg_app.todays_entries
	$scope.prefs         = bg_app.get_preferences()
	$scope.current_hours = bg_app.current_hours.toClockTime()
	$scope.total_hours   = bg_app.total_hours.toClockTime()
	$scope.tasks =
		billable: []
		non_billable: []

	$scope.refresh = ->
		bg_app.refresh_hours ->
			$scope.projects      = bg_app.projects
			$scope.clients       = bg_app.clients
			$scope.timers        = bg_app.todays_entries
			$scope.prefs         = bg_app.get_preferences()
			$scope.current_hours = bg_app.current_hours.toClockTime()
			$scope.total_hours   = bg_app.total_hours.toClockTime()
			$scope.$apply()
	
	$scope.add_timer = ->
		task =
			project_id: $scope.task_project
			task_id: $scope.task_task
			hours: $scope.task_hours
			notes: $scope.task_notes
		console.log task
	
	$scope.project_change = ->
		$scope.tasks =
			billable: []
			non_billable: []
		tasks = bg_app
			.project_db
			.first(id: parseInt($scope.task_project))
			.tasks

		tasks.forEach (task) ->
			if task.billable
				$scope.tasks.billable.push task
			else
				$scope.tasks.non_billable.push task
	
	$scope.toggle_timer = (timer_id) ->
		result = bg_app.client.toggle_timer timer_id
		result.success (json) ->
			$scope.refresh()
	
	$scope.delete_timer = (timer_id) ->
		result = bg_app.client.delete_entry timer_id
		result.complete ->
			console.log "#{timer_id} deleted"
			$scope.refresh()
	
	$scope.show_form = ->
		$overlay = $('#form-overlay')
		
		if $('body').height() < 300
			$('body').data 'oldHeight', $('body').height()
		else
			$('body').removeData 'oldHeight'

		$overlay.fadeIn 300, ->
			$('body').animate {height: "#{$overlay.height()}px"}, 300 if $('body').height() < $overlay.height()
	
	$scope.hide_form = ->
		$overlay = $('#form-overlay')

		if $('body').data 'oldHeight'
			$('body').animate {height: "#{$('body').data('oldHeight')}px"}, 300, ->
				$overlay.fadeOut 300

window.TasksController = TasksController
