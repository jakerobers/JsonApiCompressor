gulp = require('gulp')
mocha = require('gulp-mocha')

paths =
  input: ['spec/**/*.js']

gulp.task 'test:run', ->
  gulp.src(paths.input)
  .pipe(mocha())
#END test