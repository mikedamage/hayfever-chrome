###
Hex Color Utility Functions
###

$ = jQuery

$.hexPairToDecimal = (hex) ->
  parseInt hex, 16

$.hexColorToRGBA = (str, alpha=255) ->
  hex_string = str.replace '#', ''
  red_val = hex_string.substring 0, 2
  green_val = hex_string.substring 2, 4
  blue_val = hex_string.substring 4, 6
  color_array = [red_val, green_val, blue_val].map (val) ->
    $.hexPairToDecimal val
  color_array[3] = alpha
  color_array
