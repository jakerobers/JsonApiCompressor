gulp = require("gulp")
runSequence = require("run-sequence")
require('./gulp_tasks/clean.task.coffee')
require('./gulp_tasks/javascript.task.coffee')
require('./gulp_tasks/test.task.coffee')
require('./gulp_tasks/vendor.task.coffee')

gulp.task 'build', (cb) ->
  return runSequence(
    'clean',
    'vendor',
    'javascript',
    'watch:javascript'
    cb
  )
#END build

gulp.task 'test', (cb) ->
  return runSequence(
    'build',
    'test:run'
  )

gulp.task('default', ['build']);
