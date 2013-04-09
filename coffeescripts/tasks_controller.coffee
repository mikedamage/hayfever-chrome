###
Angular.js Popup Tasks Controller
###

TasksController = ($scope) ->
	bg_page = chrome.extension.getBackgroundPage()
	bg_app = bg_page.application

	$scope.projects = bg_app.projects
	$scope.timers = bg_app.todays_entries

window.TasksController = TasksController
