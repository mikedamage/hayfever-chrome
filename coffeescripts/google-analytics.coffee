# Google Analytics Snippet

chrome.storage.local.get 'hayfever_prefs', (prefs) ->
  if !_(prefs).isEmpty() and prefs.enable_analytics
    window._gaq = _gaq || []
    _gaq.push [ '_setAccount', 'UA-21680103-1' ]
    _gaq.push [ '_trackPageView' ]

    do ->
      ga = document.createElement 'script'
      ga.type = 'text/javascript'
      ga.async = true
      ga.src = 'https://ssl.google-analytics.com/ga.js'
      s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore ga, s
