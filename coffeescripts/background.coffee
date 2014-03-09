###
Background Page Main JavaScript
###

BackgroundApplication.get_auth_data (items) ->
  subdomain   = items.harvest_subdomain
  auth_string = items.harvest_auth_string

  if subdomain and auth_string
    window.application = new BackgroundApplication subdomain, auth_string
    setTimeout window.application.refresh_hours, 500
  else
    if localStorage['harvest_subdomain'] and localStorage['harvest_auth_string']
      console.log "Migrating preferences from localStorage to chrome.storage.local"
      BackgroundApplication.migrate_preferences (items) ->
        window.application = new BackgroundApplication items.harvest_subdomain, items.harvest_auth_string
        setTimeout window.application.refresh_hours, 500
    else
      window.application = new BackgroundApplication false, false
      chrome.browserAction.setBadgeText text: '!'
      console.error 'Error initializing Hayfever. Please visit the options page.'
  
