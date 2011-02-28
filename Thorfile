# module: project
class Project < Thor
	include Thor::Actions

	desc 'bundle', 'Bundle the project into a zip file'
	def bundle(filename)
		require "pathname"
		
		file = Pathname.new(filename)
		dir = file.dirname
		temp = dir + 'hayfever-chrome'

		say "Syncing files to temp. location"
		IO.popen("rsync -avr --exclude=.git --exclude=.gitignore --exclude=Thorfile --exclude=.DS_Store ./ #{temp.expand_path.to_s}/") do |rsync|
			while line = rsync.gets
				say line
			end
		end

		say "Compressing"
		Dir.chdir(dir)
		`zip -r hayfever.zip #{temp.basename.to_s}`
	end
end

# vim: set ft=ruby sw=2 ts=2 :
