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
	var autoprefixer = require('gulp-autoprefixer'),
		inline = require('rework-plugin-inline'),
		minify = require('gulp-minify-css'),
		sourcemaps = require('gulp-sourcemaps'),
		rework = require('gulp-rework'),
		when = require('gulp-if');

	return gulp
		.src('./src/assets/css/*.css', base)
		.pipe(when(config.isWatching, sourcemaps.init()))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(minify({
			keepBreaks: true,
			processImport: true,
			relativeTo: './src/assets/css/'
		}))
		.pipe(when(config.isWatching, sourcemaps.write()))
		.pipe(gulp.dest('./web/'));
});

gulp.task('copy', function () {
	return gulp
		.src('./src/{CNAME,LICENSE,README.md,assets/img/*.jpg,favicon.ico}', base)
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
