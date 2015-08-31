gulp = require('gulp')
jasmine = require('gulp-jasmine')

paths =
	input: ['spec/**/*.js']

gulp.task 'test', ->
	gulp.src(paths.input)
	.pipe(jasmine())
#END test