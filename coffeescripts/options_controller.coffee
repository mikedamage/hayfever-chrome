###
Hayfever for Chrome
Options Page Controller

by Mike Green (mike.is.green@gmail.com)
###

app = angular.module 'hayfeverOptions', [ 'ngAnimate' ]

options_controller = ($scope) ->
  bg_page     = chrome.extension.getBackgroundPage()
  bg_app      = bg_page.application
  storage     = chrome.storage.local
  option_keys = [
    'harvest_subdomain'
    'harvest_username'
    'harvest_auth_string'
    'hayfever_prefs'
  ]

  $scope.debug_mode           = false
  $scope.password_placeholder = ''

  # Load options from local storage
  storage.get option_keys, (items) ->
    $scope.subdomain            = items.harvest_subdomain
    $scope.username             = items.harvest_username
    $scope.auth_string          = items.harvest_auth_string
    $scope.preferences          = items.hayfever_prefs || { badge_display: 'total', badge_format: 'clock', badge_color: '#207aac' }
    $scope.password_placeholder = if $scope.auth_string then 'Password Saved' else 'Enter Password'
    $scope.$apply()

  $scope.hide_banner = ->
    $scope.options_saved = false
    $scope.$apply()

  $scope.save_options = ->
    options =
      harvest_subdomain: $scope.subdomain
      harvest_username: $scope.username
      hayfever_prefs: $scope.preferences
    options.harvest_auth_string = btoa("#{$scope.username}:#{$scope.password}") if $scope.username and $scope.password

    storage.set options, ->
      $scope.password      = null
      $scope.auth_string   = options.harvest_auth_string

      chrome.runtime.sendMessage { method: 'reload_app' }, (resp) ->
        setTimeout $scope.hide_banner, 5e3
        $scope.options_saved = true
        $scope.$apply()
        scrollTo 0, 0

app.controller 'OptionsController', [ '$scope', options_controller ]
