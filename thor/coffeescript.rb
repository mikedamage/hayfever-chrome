# module: coffeescript
class Coffeescript < Thor
	include Thor::Actions

	desc 'compile', 'Compile CoffeeScripts to js/ folder'
	def compile
		`which coffee`

		if $?.exitstatus != 0
			say 'CoffeeScript executable not found', :red
			exit
		end

		cs_dir = $root_dir.join 'coffeescripts'
		js_dir = $root_dir.join 'build', 'js'

		say 'Compiling CoffeeScripts...', :blue
		cs_dir.children.each do |child|
			if child.basename.to_s =~ /\.coffee$/
				say_status 'compile', child.basename.to_s, :blue
				`coffee -o #{js_dir.expand_path.to_s} -c #{child.expand_path.to_s}`
			end
		end
	end

end
