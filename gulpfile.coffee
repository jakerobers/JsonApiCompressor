gulp = require("gulp")
runSequence = require("run-sequence")
require('./gulp_tasks/clean.task.coffee')
require('./gulp_tasks/javascript.task.coffee')
require('./gulp_tasks/test.task.coffee')
require('./gulp_tasks/vendor.task.coffee')

gulp.task 'build', ->
	return runSequence(
		'clean',
		'vendor',
		'coffee',
		'javascript'
	)
#END build

gulp.task('default', ['build']);
