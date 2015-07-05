'use strict';

var toga = require('toga'),
	css = require('toga-css'),
	md = require('toga-markdown'),
	sample = require('toga-sample'),
	pura = require('toga-pura'),

	config = {
		src: './src/assets/**/*.css',
		dest: './dist/docs'
	};

toga
	.src(config.src)
	.pipe(css.parser())
	.pipe(md.formatter())
	.pipe(sample.formatter())
	.pipe(pura.compiler())
	.pipe(toga.dest(config.dest));
