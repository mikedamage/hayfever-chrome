# module: project
class Project < Thor
  include Thor::Actions

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
      Pathname.glob(dist_dir.join('**', '**')).each do |file|
        zip_path = file.to_s.gsub(dist_dir.to_s, 'hayfever')
        say_status 'add', zip_path, :yellow
        zip.add zip_path, file.to_s
      end
    end

    say_status 'saved', "Saved plugin to #{output.to_s}", :green
  end
end
