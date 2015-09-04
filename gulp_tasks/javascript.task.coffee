gulp = require('gulp')
config = require('./config')
coffee = require('gulp-coffee')
concat = require('gulp-concat')
uglify = require('gulp-uglify')
sourcemaps = require('gulp-sourcemaps')

paths =
  'coffee':
    'input': [
      'assets/JsonApiCompressorBase.coffee'
      'assets/JsonApiCompressor.coffee'
    ]
    'output':
      'dir': "#{config.tmp_dir}/coffee"
      'file': "JsonApiCompressor.coffee"
    #END output
  #END coffee

  'js':
    'input': [
      "#{config.tmp_dir}/vendor/**/*.js"
      "#{config.tmp_dir}/coffee/JsonApiCompressor.js"
    ]
    'output':
      'file': 'jsonapicompressor.js'
      'dir': "#{config.app_dir}/"
    #END output
  #END js
#END paths

gulp.task 'coffee', ->
  {input, output} = paths.coffee

  gulp.src(input)
  .pipe(concat(output.file))
  .pipe(coffee())
  .pipe(gulp.dest(output.dir))
#END coffee


gulp.task 'javascript', ['coffee'], ->
  {input, output} = paths.js

  gulp.src(input)
  .pipe(sourcemaps.init())
    .pipe(concat(output.file))
    .pipe(uglify())
  .pipe(sourcemaps.write("./"))
  .pipe(gulp.dest(output.dir))
#END javascript

gulp.task 'watch:javascript', ->
  gulp.watch(paths.coffee.input, ['javascript'])



