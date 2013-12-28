###
JavaScript Core Prototype Extensions

Depends On:
  - Sugar.js
###

###
Convert string to slug
###
String.prototype.toSlug = ->
  @replace(/[^a-zA-Z0-9\s]/g, '').toLowerCase().replace(/\s/g, '_')

###
Convert a decimal time to clock time (sexagesimal)
###
Number.prototype.toClockTime = ->
  return '0:00' if this is 0

  string_val = @toFixed 2
  decimal_split = string_val.split '.'
  hours = parseInt decimal_split[0], 10
  minutes = parseFloat "0.#{decimal_split[1]}"
  minutes = parseInt minutes * 60, 10

  if minutes < 10
    time = "#{hours}:0#{minutes}"
  else
    time = "#{hours}:#{minutes}"
  time

###
Get Yesterday's Date
###
Date.prototype.yesterday = ->
  new Date @getTime() - 86400000

###
Format the date so Harvest can understand it
###
Date.prototype.toHarvestString = ->
  arr = @toDateString().split ' '
  "#{arr[0]}, #{arr[2]} #{arr[1]} #{arr[3]}"

###
Get day of year
###
Date.prototype.getDOY = ->
  jan_one = Date.create().beginningOfYear()
  Math.round((this - jan_one) / 864e5) + 1

###
Array any() function
###
Array.prototype.any = ->
  @length > 0
