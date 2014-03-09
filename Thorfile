
$root_dir  = Pathname.new File.dirname(__FILE__)
$build_dir = $root_dir.join 'build'

Pathname.glob($root_dir.join('thor', '*.{rb,thor}')).each do |mod|
  require mod
end

# vim: set ft=ruby sw=2 ts=2 :
