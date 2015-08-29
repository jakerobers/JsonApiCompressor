var gulp = require("gulp"),
	concat = require("gulp-concat"),
	gutil = require("gutil"),
	del = require("del"),
	runSequence = require("run-sequence");


gulp.task('buildSrc', function() {
	var src = [
		'node_modules/underscore/underscore-min.js',
		'node_modules/q/q.js',
		'assets/*.coffee'
	];
	gulp.src(src)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('jsonapi_compressor.js'))
    .pipe(gulp.dest('./.build/'))
});

gulp.task('buildSpec', function() {
	gulp.src([".build/jsonapi_compressor.js","tests/**/*-spec.js"])
		.pipe(concat('all-spec.js'))
		.pipe(gulp.dest('spec/'));
});

gulp.task("clean", function(finish) {
	del(['.build', 'spec/all-spec'], finish)
});

gulp.task('build', function() {
	return runSequence('clean', 'buildSrc', 'buildSpec')
});

gulp.task('default', ['build']);
