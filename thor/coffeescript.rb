# module: coffeescript

require 'coffee-script'

class Coffeescript < Thor
  include Thor::Actions

  desc 'compile', 'Compile CoffeeScripts to js/ folder'
  method_option :source_maps, type: :boolean, desc: "Generate source maps along with JS files"
  def compile
    cs_dir = $root_dir.join 'coffeescripts'
    js_dir = $build_dir.join 'js'

    say 'Compiling CoffeeScripts...', :bold

    Pathname.glob(cs_dir.join('*.coffee')).each do |file|
      input_cs        = file.read
      timestamp       = Time.now.strftime '%Y-%m-%d %H:%M:%S'
      compile_header  = "// Compiled by CoffeeScript #{CoffeeScript.version} on #{timestamp}\n"
      bare_compile    = input_cs =~ /^#\s*@bare$/ ? true : false
      output_filename = file.basename.sub_ext '.js'

      begin
        output_js = CoffeeScript.compile input_cs, bare: bare_compile
      rescue
        say_status 'error', file.basename.to_s, red
        next
      end

      say_status 'save', output_filename.to_s, :green
      js_dir.join(output_filename).open('w') do |js_file|
        js_file.puts  compile_header
        js_file.write output_js
      end
    end
  end
end
