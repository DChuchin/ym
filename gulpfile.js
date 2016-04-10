/*------------ plugins -----------------*/
var
	gulp         = require('gulp'),
	jade         = require('gulp-jade'),
	sass         = require('gulp-sass'),
	sourcemaps   = require('gulp-sourcemaps'),
	del          = require('del'),
	autoprefixer = require('gulp-autoprefixer'),
	runSequence  = require('run-sequence'),
	browserSync  = require('browser-sync').create(),
	uglify       = require('gulp-uglify'),
	rename       = require('gulp-rename'),
	plumber      = require('gulp-plumber'),
	concat       = require('gulp-concat');

/*---------------- paths ----------------------*/

var
	paths = {
		jade : {
			locations   : 'dev/jade/**/*.jade',
			compiled    : 'dev/jade/pages/*.jade',
			destination : 'dist'
		},

		scss : {
			locations   : 'dev/styles/**/*.scss',
			compiled    : 'dev/styles/main.scss',
			destination : 'dist/common/css'
		},

		js : {
			locations   : 'dev/scripts/main.js',
			plugins     : 'dev/scripts/plugins/*.js',
			destination : 'dist/common/js'
		},

		browserSync : {
			baseDir   : './dist/',
			watchPaths : ['dist/*.html', 'dist/**/*.css', 'dist/common/js/*.js' ]
		},

		build : 'dist/*'
	};

/*---------------- jade ------------------------*/

gulp.task('jade', function() {
	gulp.src(paths.jade.compiled)
		.pipe(plumber())
		.pipe(jade({
			pretty: '\t',
		}))
		.pipe(gulp.dest(paths.jade.destination));
});

/*-------------- sass -------------------*/

gulp.task('sass', function() {
	gulp.src(paths.scss.locations)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers : [ '> 1%', 'last 2 versions', 'ie >=9']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.scss.destination))
});

/*---------- browser-sync -----------*/

gulp.task('sync', function () {
	browserSync.init({
		server: {
			baseDir: paths.browserSync.baseDir
		}
	});
});

/*---------------- scripts -----------*/

gulp.task('scripts', function() {
	gulp.src(paths.js.locations)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.js.destination))
});

/*------------ images -----------------*/

/*---------------- clean ------------*/

gulp.task('clean', function () {
	del(paths.build)
});

/*-------------- watch ---------------*/

gulp.task('watch', function() {
	gulp.watch(paths.jade.locations, ['jade']);
	gulp.watch(paths.scss.locations, ['sass']);
	gulp.watch(paths.js.locations, ['scripts']);
	gulp.watch(paths.browserSync.watchPaths).on('change', browserSync.reload);
});

/*------------------ default ------------*/

gulp.task('default', ['jade', 'sass', 'scripts', 'sync', 'watch']); 