###
Angular.js Popup Tasks Controller
###

app = angular.module 'hayfeverApp', ['ui']


tasks_controller = ($scope) ->
  bg_page = chrome.extension.getBackgroundPage()
  bg_app  = bg_page.application

  $scope.form_visible    = false
  $scope.spinner_visible = false
  $scope.runaway_timer   = false
  $scope.harvest_url     = if bg_app.client.subdomain then bg_app.client.full_url else null
  $scope.authorized      = bg_app.authorized
  $scope.projects        = bg_app.projects
  $scope.timers          = bg_app.todays_entries
  $scope.prefs           = bg_app.preferences
  $scope.current_hours   = bg_app.current_hours
  $scope.total_hours     = bg_app.total_hours
  $scope.current_task    = bg_app.current_task
  $scope.active_timer_id = 0
  $scope.tasks           = []
  $scope.form_task       =
    project: null
    task: null
    hours: null
    notes: null

  $scope.refresh = ->
    bg_app.refresh_hours ->
      $scope.harvest_url   = if bg_app.client.subdomain then bg_app.client.full_url else null
      $scope.authorized    = bg_app.authorized
      $scope.projects      = bg_app.projects
      $scope.clients       = bg_app.clients
      $scope.timers        = bg_app.todays_entries
      $scope.current_hours = bg_app.current_hours
      $scope.total_hours   = bg_app.total_hours
      $scope.current_task  = bg_app.current_task

      bg_app.get_preferences ->
        $scope.prefs = bg_app.preferences
        $scope.$apply()

      $scope.$apply()
  
  $scope.add_timer = ->
    task =
      project_id: $scope.form_task.project
      task_id: $scope.form_task.task
      hours: $scope.form_task.hours
      notes: $scope.form_task.notes
    result = if $scope.active_timer_id != 0 then bg_app.client.update_entry($scope.active_timer_id, task) else bg_app.client.add_entry(task)
    result.success (json) ->
      $scope.hide_form()
      $scope.refresh()
  
  $scope.project_change = ->
    $scope.tasks = []
    current_project = _(bg_app.projects).find (p) -> p.id == parseInt($scope.form_task.project)
    tasks = current_project.tasks

    tasks.forEach (task) ->
      task.billable_text = if task.billable then 'Billable' else 'Non Billable'
      $scope.tasks.push task
  
  $scope.toggle_timer = (timer_id) ->
    result = bg_app.client.toggle_timer timer_id
    result.success (json) ->
      $scope.refresh()
  
  $scope.delete_timer = (timer_id) ->
    result = bg_app.client.delete_entry timer_id
    result.complete ->
      $scope.refresh()
  
  $scope.show_form = (timer_id=0) ->
    $scope.active_timer_id = timer_id
    $scope.reset_form_fields()

    unless $scope.active_timer_id is 0
      timer = _(bg_app.todays_entries).find (item) -> item.id == $scope.active_timer_id

      if timer
        $scope.form_task.project = parseInt timer.project_id, 10
        $scope.form_task.task = parseInt timer.task_id, 10
        $scope.form_task.hours = timer.hours
        $scope.form_task.notes = timer.notes
        $scope.project_change()
    
    $scope.form_visible = true
  
  $scope.hide_form = ->
    $scope.form_visible = false
  
  $scope.reset_form_fields = ->
    $scope.form_task =
      project: null
      task: null
      hours: null
      notes: null

clock_time_filter = ->
  (input) ->
    input.toClockTime()

app.controller 'TasksController', [ '$scope', tasks_controller ]
app.filter 'clockTime', clock_time_filter
