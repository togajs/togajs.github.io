'use strict';

var gulp = require('gulp'),
	config = {
		src: './src',
		dest: './dist',
		isWatching: false
	},
	base = {
		base: config.src
	};

gulp.task('default', ['html', 'css', 'copy']);

gulp.task('html', function () {
	var fm = require('gulp-front-matter'),
		hb = require('gulp-hb');

	return gulp
		.src(config.src + '/*.html', base)
		.pipe(fm({ property: 'meta' }))
		.pipe(hb())
		.pipe(gulp.dest(config.dest));
});

gulp.task('css', function () {
	var myth = require('gulp-myth');

	return gulp
		.src(config.src + '/assets/css/*.css', base)
		.pipe(myth({
			browsers: ['last 2 versions'],
			compress: true,
			source: config.src + '/assets/css/',
			sourcemap: config.isWatching
		}))
		.pipe(gulp.dest(config.dest));
});

gulp.task('copy', function () {
	return gulp
		.src(config.src + '/{CNAME,LICENSE,README.md,assets/img/**}', base)
		.pipe(gulp.dest(config.dest));
});

gulp.task('deploy', ['default'], function () {
	var deploy = require('gulp-gh-pages');

	return gulp
		.src(config.dest + '/**/*')
		.pipe(deploy({
			branch: 'master'
		}));
});
