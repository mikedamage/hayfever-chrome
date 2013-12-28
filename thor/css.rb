# module: css
class CSS < Thor
	include Thor::Actions

	desc 'compile', 'Compile Compass/SASS stylesheets to CSS'
	def compile
		Dir.chdir $root_dir.to_s
    run "compass compile"
	end
end
