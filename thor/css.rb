require 'compass'
require 'compass/commands'
require 'yui/compressor'

# module: css
class CSS < Thor
  include Thor::Actions

  desc 'compile', 'Compile Compass/SASS stylesheets to CSS'
  method_option :minify,
    type: :boolean,
    default: false,
    desc: "Also minify compiled CSS files",
    aliases: %w( -m )
  method_option :force,
    type: :boolean,
    default: false,
    desc: 'Force recompilation',
    aliases: %w( -f )
  def compile
    say 'Compiling Sass stylesheets', :bold
    compass_cmd = Compass::Commands::UpdateProject.new $root_dir, force: options.force
    compass_cmd.perform

    thor 'css:minify' if options.minify
  end

  desc 'minify', 'Compress CSS'
  def minify
    css_dir = $build_dir.join 'css'
    files = Pathname.glob(css_dir.join('*.css'))

    files.each do |file|
      next if file.fnmatch? '*.min.css'

      minifier      = YUI::CssCompressor.new
      minified      = minifier.compress file.read
      mini_filename = file.sub_ext '.min.css'

      say_status 'save', mini_filename.basename.to_s, :green
      mini_filename.open('w') {|f| f.write minified }
    end
  end
end
