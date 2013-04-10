###
Angular.js Popup Tasks Controller
###

angular.module 'hayfeverApp', ['ui']

TasksController = ($scope) ->
	bg_page = chrome.extension.getBackgroundPage()
	bg_app = bg_page.application

	$scope.projects = bg_app.projects
	$scope.clients = bg_app.clients
	$scope.timers = bg_app.todays_entries
	$scope.tasks =
		billable: []
		non_billable: []

	$scope.refresh = ->
		bg_app.refresh_hours ->
			$scope.projects = bg_app.projects
			$scope.timers = this
	
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


window.TasksController = TasksController
