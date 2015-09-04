gulp = require('gulp')
config = require('./config')
rimraf = require('rimraf')

gulp.task 'clean:tmp', (cb) ->
  rimraf(config.tmp_dir, cb)
#END clean:tmp

gulp.task 'clean:dist', (cb) ->
  rimraf(config.app_dir, cb)
#END clean:dist

gulp.task 'clean', ['clean:tmp', 'clean:dist']