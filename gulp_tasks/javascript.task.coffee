gulp = require('gulp')
config = require('./config')
coffee = require('gulp-coffee')
concat = require('gulp-concat')

paths =
  'coffee':
    'input': ['assets/**/*.coffee']
    'output':
      'dir': "#{config.tmp_dir}/coffee"
    #END output
  #END coffee

  'js':
    'input': [
      "#{config.tmp_dir}/vendor/**/*.js"
      "#{config.tmp_dir}/coffee/**/*.js"
    ]
    'output':
      'file': 'app.js'
      'dir': "#{config.app_dir}/"
    #END output
  #END js
#END paths

gulp.task 'coffee', ->
  {input, output} = paths.coffee

  gulp.src(input)
  .pipe(coffee())
  .pipe(gulp.dest(output.dir))
#END coffee


gulp.task 'javascript', ->
  {input, output} = paths.js

  gulp.src(input)
  .pipe(concat(output.file))
  .pipe(gulp.dest(output.dir))
#END javascript



