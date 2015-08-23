var gulp = require("gulp"),
	concat = require("gulp-concat"),
	del = require("del"),
	runSequence = require("run-sequence");


gulp.task('buildSpec', function() {
	gulp.src(["jsonapi_compressor.js","tests/**/*-spec.js"])
		.pipe(concat('all-spec.js'))
		.pipe(gulp.dest('spec/'));
});

gulp.task("clean", function(finish) {
	del(['spec/all-spec'], finish)
});

gulp.task('test', function() {
	return runSequence('clean', 'buildSpec')
});

gulp.task('default', ['test']);
