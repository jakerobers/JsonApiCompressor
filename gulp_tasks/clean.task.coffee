gulp = require('gulp')
config = require('./config')
rimraf = require('rimraf')

gulp.task 'clean', (cb) ->
  rimraf(config.build_dir, cb)
#END clean