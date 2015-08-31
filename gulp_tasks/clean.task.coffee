gulp = require('gulp')
config = require('./config')
del = require('del')

gulp.task 'clean', ->
	del(config.build_dir)
#END clean