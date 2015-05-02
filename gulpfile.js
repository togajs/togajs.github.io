'use strict';

var gulp = require('gulp'),
	base = { base: './src/' },
	config = { isWatching: false };

gulp.task('default', ['html', 'css', 'copy']);

gulp.task('deploy', ['default'], function () {
	var deploy = require('gulp-gh-pages');

	return gulp
		.src('./web/**/*')
		.pipe(deploy({
			branch: 'master'
		}));
});

gulp.task('html', function () {
	var fm = require('gulp-front-matter'),
		hb = require('gulp-hb');

	return gulp
		.src('./src/*.html', base)
		.pipe(fm({ property: 'meta' }))
		.pipe(hb())
		.pipe(gulp.dest('./web/'));
});

gulp.task('css', function () {
	var myth = require('gulp-myth');

	return gulp
		.src('./src/assets/css/*.css', base)
		.pipe(myth({
			browsers: ['last 2 versions'],
			compress: true,
			source: './src/assets/css/',
			sourcemap: config.isWatching
		}))
		.pipe(gulp.dest('./web/'));
});

gulp.task('copy', function () {
	return gulp
		.src('./src/{CNAME,LICENSE,README.md,assets/img/**}', base)
		.pipe(gulp.dest('./web/'));
});

gulp.task('watch', function () {
	var watch = require('gulp-watch'),
		lr = require('gulp-livereload');

	config.isWatching = true;

	watch('./src/**/*.html', function () {
		gulp.start('html');
	});

	watch('./src/**/*.css', function () {
		gulp.start('css');
	});

	watch('./src/assets/images/**/*.*', function () {
		gulp.start('copy');
	});

	watch('./web/**/*.*').pipe(lr());
});
