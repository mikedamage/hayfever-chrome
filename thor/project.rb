# module: project
class Project < Thor
  include Thor::Actions

  @@excludes = [
    /\.map$/
  ]

  desc 'build', 'Compile all Sass and CoffeeScript assets'
  def build
    thor "css:compile"
    thor "coffeescript:compile"
  end

  desc 'zip_release [OUTPUT_DIR]', 'Bundle the project into a zip file'
  def zip_release(output_dir = $root_dir.join('pkg'))
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
      files = Pathname.glob dist_dir.join('**', '**')

      files.delete_if do |f|
        matches = @@excludes.map {|pattern| f.expand_path.to_s =~ pattern }
        matches.any? {|m| m.is_a?(Fixnum) }
      end

      files.each do |file|
        zip_path = file.to_s.gsub(dist_dir.to_s, 'hayfever')
        say_status 'add', zip_path, :yellow
        zip.add zip_path, file.to_s
      end
    end

    say_status 'saved', "Saved plugin to #{output.to_s}", :green
  end

  desc 'watch', 'Compile Sass and CoffeeScript files when they change'
  def watch
    require 'listen'

    listener = Listen.to $root_dir.expand_path.to_s do |modified, added, removed|
      if modified.any?
        commands = modified.map do |file|
          if file =~ /\.scss$/
            'css:compile'
          elsif file =~ /\.coffee$/
            'coffeescript:compile'
          else
            nil
          end
        end

        commands.uniq!
        commands.delete_if {|cmd| cmd.nil? } if commands.any?
        commands.each {|cmd| thor cmd } if commands.any?
      end
    end

    listener.start
    listener.ignore %r{\.git}
    listener.ignore %r{build/}
    listener.ignore %r{thor/}
    listener.ignore %r{pkg/}
    listener.ignore %r{test/}
    listener.ignore %r{thor/}

    Signal.trap 'INT' do
      say 'Stopping listener and exiting...', :yellow
      listener.stop
      exit 0
    end

    say 'Watching project folder for changes...', :yellow
    sleep
  end
end
