# Google Analytics Snippet

chrome.storage.local.get 'hayfever_prefs', (prefs) ->
  if !_(prefs.hayfever_prefs).isEmpty() and prefs.hayfever_prefs.enable_analytics
    window._gaq = []
    _gaq.push [ '_setAccount', 'UA-21680103-1' ]
    _gaq.push [ '_trackPageView' ]

    do ->
      ga = document.createElement 'script'
      ga.type = 'text/javascript'
      ga.async = true
      ga.src = 'js/vendor/ga.js'
      s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore ga, s
