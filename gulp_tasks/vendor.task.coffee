gulp        = require('gulp')
concat       = require('gulp-concat')
config         = require('./config')

paths =
  input: [
    'bower_components/underscore/underscore-min.js'
  ]
  output:
    file: 'vendor.js'
    dir: "#{config.tmp_dir}/vendor"
  #END output


gulp.task 'vendor', ->
  {input, output} = paths

  gulp.src(input)
  .pipe(concat(output.file))
  .pipe(gulp.dest(output.dir))
#END vendor
