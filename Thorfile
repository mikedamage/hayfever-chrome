# module: project
class Project < Thor
	include Thor::Actions

	@@excludes = [
		'.git',
		'.gitignore',
		'Thorfile',
		'.DS_Store',
		'sass',
		'.sass-cache',
		'test',
		'coffeescripts',
		'config.rb',
		'.rvmrc',
		'Gemfile',
		'Gemfile.lock'
	].map {|exc| "--exclude=#{exc}"}.join(' ')

	desc 'bundle DIRNAME', 'Bundle the project into a zip file'
	def bundle(dirname)
		require "pathname"
		
		dir = Pathname.new(dirname)

		say "Syncing files to temp. location"
		IO.popen("rsync -avr #{@@excludes} ./ #{dir.expand_path.to_s}/") do |rsync|
			while line = rsync.gets
				say line
			end
		end

		say "Compressing"
		Dir.chdir(dir.dirname)
		`zip -r hayfever.zip #{dir.basename.to_s}`
	end

	desc 'prep_release', 'Syncs all necessary files to ~/ProjectFiles/Hayfever/hayfever in preparation for packing in Chrome'
	def prep_release
		invoke 'css:compile'
		invoke 'coffeescript:compile'

		sync_dir = Pathname.new("~/ProjectFiles/Hayfever/hayfever")
		
		unless sync_dir.directory?
			say_status 'mkdir', 'Creating sync directory', :yellow
			`mkdir -p ~/ProjectFiles/Hayfever/hayfever`
		end

		say 'Copying files to ~/ProjectFiles/Hayfever/hayfever', :blue
		IO.popen("rsync -avr #{@@excludes} --delete ./ ~/ProjectFiles/Hayfever/hayfever/") do |rsync|
			while line = rsync.gets
				say line
			end
		end
		say 'Done.', :green
	end
end

# module: coffeescript
class Coffeescript < Thor
	include Thor::Actions

	desc 'compile', 'Compile CoffeeScripts to js/ folder'
	def compile
		require 'pathname'
		`which coffee`

		if $?.exitstatus != 0
			say 'CoffeeScript executable not found', :red
			exit
		end

		project_dir = Pathname.new(File.dirname(__FILE__))
		cs_dir = project_dir.join 'coffeescripts'
		js_dir = project_dir.join 'js'

		say 'Compiling CoffeeScripts...', :blue
		cs_dir.children.each do |child|
			if child.basename.to_s =~ /\.coffee$/
				say_status 'compile', child.basename.to_s, :blue
				`coffee -o js/ -c #{child.expand_path.to_s}`
			end
		end
	end

end

# module: css
class CSS < Thor
	include Thor::Actions

	desc 'compile', 'Compile Compass/SASS stylesheets to CSS'
	def compile
		Dir.chdir(File.dirname(__FILE__))

		say 'Compiling stylesheets...', :blue

		IO.popen 'compass compile' do |compass|
			while line = compass.gets
				say line
			end
		end
	end
end

# vim: set ft=ruby sw=2 ts=2 :
