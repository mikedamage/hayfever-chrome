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
		'test'
	].map {|exc| "--exclude=#{exc}"}.join(' ')

	desc 'bundle', 'Bundle the project into a zip file'
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
		say_status 'sync', 'Copying files to ~/ProjectFiles/Hayfever/hayfever'
		IO.popen("rsync -avr #{@@excludes} ./ /Users/mike/ProjectFiles/Hayfever/hayfever/") do |rsync|
			while line = rsync.gets
				say line
			end
		end
		say 'Done.', :green
	end
end

# vim: set ft=ruby sw=2 ts=2 :
