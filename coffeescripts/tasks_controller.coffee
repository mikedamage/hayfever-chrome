###
Angular.js Popup Tasks Controller
###

app = angular.module 'hayfeverApp', ['ui']


tasks_controller = ($scope) ->
  $scope.form_visible    = false
  $scope.spinner_visible = false
  $scope.runaway_timer   = false
  $scope.active_timer_id = 0
  $scope.current_hours   = 0.0
  $scope.total_hours     = 0.0
  $scope.tasks           = []
  $scope.form_task       =
    project: null
    task: null
    hours: null
    notes: null

  # Grab background application data
  chrome.runtime.sendMessage { method: 'get_entries' }, (resp) ->
    $scope.harvest_url   = resp.harvest_url
    $scope.authorized    = resp.authorized
    $scope.projects      = resp.projects
    $scope.clients       = resp.clients
    $scope.timers        = resp.timers
    $scope.prefs         = resp.preferences
    $scope.current_hours = resp.current_hours
    $scope.total_hours   = resp.total_hours
    $scope.current_task  = resp.current_task

    $scope.$apply()

  $scope.refresh = ->
    chrome.runtime.sendMessage { method: 'refresh_hours' }, (resp) ->
      $scope.harvest_url   = resp.harvest_url
      $scope.authorized    = resp.authorized
      $scope.projects      = resp.projects
      $scope.clients       = resp.clients
      $scope.timers        = resp.timers
      $scope.current_hours = resp.current_hours
      $scope.prefs         = resp.preferences
      $scope.total_hours   = resp.total_hours
      $scope.current_task  = resp.current_task
      console.dir resp
      $scope.$apply()

    chrome.runtime.sendMessage { method: 'get_preferences' }, (resp) ->
      $scope.prefs = resp.preferences
      $scope.$apply()
  
  $scope.add_timer = ->
    task =
      project_id: $scope.form_task.project
      task_id: $scope.form_task.task
      hours: $scope.form_task.hours
      notes: $scope.form_task.notes
    chrome.runtime.sendMessage { method: 'add_timer', active_timer_id: $scope.active_timer_id, task: task }, (resp) ->
      $scope.hide_form()
      $scope.refresh()
  
  $scope.project_change = ->
    $scope.tasks = []
    current_project = _($scope.projects).find (p) -> p.id == parseInt($scope.form_task.project)
    tasks = current_project.tasks

    tasks.forEach (task) ->
      task.billable_text = if task.billable then 'Billable' else 'Non Billable'
      $scope.tasks.push task
  
  $scope.toggle_timer = (timer_id) ->
    chrome.runtime.sendMessage { method: 'toggle_timer', timer_id: timer_id }, (resp) ->
      $scope.refresh()
  
  $scope.delete_timer = (timer_id) ->
    chrome.runtime.sendMessage { method: 'delete_timer', timer_id: timer_id }, (resp) ->
      $scope.refresh()
  
  $scope.show_form = (timer_id=0) ->
    $scope.active_timer_id = timer_id
    $scope.reset_form_fields()

    unless $scope.active_timer_id is 0
      timer = _($scope.timers).find (item) -> item.id == $scope.active_timer_id

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
