
$root_dir = Pathname.new File.dirname(__FILE__)

$root_dir.join('thor').children.each do |script|
  require script if script.to_s =~ /\.rb$/ || script.to_s =~ /\.thor$/
end

# vim: set ft=ruby sw=2 ts=2 :
