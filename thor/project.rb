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

  desc 'build', 'Compile all assets (CoffeeScript and Sass)'
  def build
    thor "css:compile"
    thor "coffeescript:compile"
  end

	desc 'bundle [OUTPUT_DIR]', 'Bundle the project into a zip file'
	def bundle(output_dir = $root_dir.join('pkg'))
    require 'json'
    require 'zip'

    thor "project:build"

    pkg_dir  = Pathname.new output_dir
    dist_dir = $root_dir.join 'build'
    manifest = JSON.parse dist_dir.join('manifest.json').read
    version  = manifest['version']
    output   = pkg_dir.join "hayfever-v#{version}.zip"

    unless pkg_dir.directory?
      say_status 'mkdir', pkg_dir.to_s, :yellow
      Dir.mkdir pkg_dir
    end

    if output.file?
      say_status 'rm', output.to_s, :yellow
      output.unlink
    end

    Zip::File.open(output.to_s, Zip::File::CREATE) do |zip|
      Pathname.glob(dist_dir.join('**', '**')).each do |file|
        # [todo] - Finish bundle zip task
        zip_path = file.to_s.gsub(dist_dir.to_s, 'hayfever')
        say_status 'add', zip_path, :yellow
        zip.add zip_path, file.to_s
      end
    end

    say_status 'saved', "Saved plugin to #{output.to_s}", :green
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
