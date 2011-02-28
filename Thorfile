# module: project
class Project < Thor
	include Thor::Actions

	desc 'bundle', 'Bundle the project into a zip file'
	def bundle(dirname)
		require "pathname"
		
		dir = Pathname.new(dirname)

		say "Syncing files to temp. location"
		IO.popen("rsync -avr --exclude=.git --exclude=.gitignore --exclude=Thorfile --exclude=.DS_Store ./ #{dir.expand_path.to_s}/") do |rsync|
			while line = rsync.gets
				say line
			end
		end

		say "Compressing"
		Dir.chdir(dir.dirname)
		`zip -r hayfever.zip #{dir.basename.to_s}`
	end
end

# vim: set ft=ruby sw=2 ts=2 :
