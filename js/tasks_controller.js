// Generated by CoffeeScript 1.4.0

/*
Angular.js Popup Tasks Controller
*/


(function() {
  var TasksController;

  angular.module('hayfeverApp', ['ui']);

  TasksController = function($scope) {
    var bg_app, bg_page;
    bg_page = chrome.extension.getBackgroundPage();
    bg_app = bg_page.application;
    $scope.harvest_url = bg_app.client.full_url;
    $scope.projects = bg_app.projects;
    $scope.clients = bg_app.clients;
    $scope.timers = bg_app.todays_entries;
    $scope.prefs = bg_app.get_preferences();
    $scope.current_hours = bg_app.current_hours.toClockTime();
    $scope.total_hours = bg_app.total_hours.toClockTime();
    $scope.active_timer_id = 0;
    $scope.tasks = [];
    $scope.form_task = {
      project: null,
      task: null,
      hours: null,
      notes: null
    };
    $scope.refresh = function() {
      return bg_app.refresh_hours(function() {
        $scope.projects = bg_app.projects;
        $scope.clients = bg_app.clients;
        $scope.timers = bg_app.todays_entries;
        $scope.prefs = bg_app.get_preferences();
        $scope.current_hours = bg_app.current_hours.toClockTime();
        $scope.total_hours = bg_app.total_hours.toClockTime();
        return $scope.$apply();
      });
    };
    $scope.add_timer = function() {
      var result, task;
      task = {
        project_id: $scope.form_task.project,
        task_id: $scope.form_task.task,
        hours: $scope.form_task.hours,
        notes: $scope.form_task.notes
      };
      result = $scope.active_timer_id !== 0 ? bg_app.client.update_entry($scope.active_timer_id, task) : bg_app.client.add_entry(task);
      return result.success(function(json) {
        $scope.hide_form();
        return $scope.refresh();
      });
    };
    $scope.project_change = function() {
      var current_project, tasks;
      $scope.tasks = [];
      current_project = _(bg_app.projects).find(function(p) {
        return p.id === parseInt($scope.form_task.project);
      });
      tasks = current_project.tasks;
      return tasks.forEach(function(task) {
        task.billable_text = task.billable ? 'Billable' : 'Non Billable';
        return $scope.tasks.push(task);
      });
    };
    $scope.toggle_timer = function(timer_id) {
      var result;
      result = bg_app.client.toggle_timer(timer_id);
      return result.success(function(json) {
        return $scope.refresh();
      });
    };
    $scope.delete_timer = function(timer_id) {
      var result;
      result = bg_app.client.delete_entry(timer_id);
      return result.complete(function() {
        return $scope.refresh();
      });
    };
    $scope.show_form = function(timer_id) {
      var $overlay, timer;
      if (timer_id == null) {
        timer_id = 0;
      }
      $scope.active_timer_id = timer_id;
      $overlay = $('#form-overlay');
      if ($scope.active_timer_id !== 0) {
        timer = _(bg_app.todays_entries).find(function(item) {
          return item.id === $scope.active_timer_id;
        });
        if (timer) {
          $scope.form_task.project = parseInt(timer.project_id, 10);
          $scope.form_task.task = parseInt(timer.task_id, 10);
          $scope.form_task.hours = timer.hours;
          $scope.form_task.notes = timer.notes;
          $scope.project_change();
        }
      }
      if ($('body').height() < 300) {
        $('body').data('oldHeight', $('body').height());
      } else {
        $('body').removeData('oldHeight');
      }
      return $overlay.fadeIn(300, function() {
        if ($('body').height() < $overlay.height()) {
          return $('body').animate({
            height: "" + ($overlay.height()) + "px"
          }, 300);
        }
      });
    };
    $scope.hide_form = function() {
      var $overlay;
      $overlay = $('#form-overlay');
      if ($('body').data('oldHeight')) {
        return $overlay.fadeOut(300, function() {
          $('body').animate({
            height: "" + ($('body').data('oldHeight')) + "px"
          }, 300);
          return $scope.reset_form_fields();
        });
      }
    };
    return $scope.reset_form_fields = function() {
      return $scope.form_task = {
        project: null,
        task: null,
        hours: null,
        notes: null
      };
    };
  };

  window.TasksController = TasksController;

}).call(this);
