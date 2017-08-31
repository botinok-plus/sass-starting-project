var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(), // синхронизация браузеров и live-reload
	sass = require('gulp-sass'), // компиляция sass
	concat = require('gulp-concat'), // конкатенация
	csso = require('gulp-csso'), // сокращение свойств css
	rename = require('gulp-rename'), // сокращение свойств css
	imagemin = require('gulp-imagemin'), // оптимизация изображений
	shorthand = require('gulp-shorthand'), // изменение файла
	uglify = require('gulp-uglify'); // сжатие JS

//path's
var path = {
	dist: 'app/',
	src: 'src/',
	sass: 'src/sass/',
	srcjs:  'src/js/',
	css:  'app/assets/css/',
	js:  'app/assets/js/',
}

//Styles
gulp.task('styles', function() {
	console.log(path.sass);
	return gulp.src(path.sass + 'inc.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(rename({
				basename: 'styles',
				suffix: '.min'
			})
		)
		.pipe(autoprefixer({browsers: ['last 50 versions'], cascade: false}))
		.pipe(shorthand())
		.pipe(csso({
			restructure: false,
			sourceMap: true,
		}))
		.pipe(gulp.dest(path.css))
		.pipe(browserSync.stream());
});

//scripts
gulp.task('scripts', function() {
	return gulp.src(path.srcjs + '*.js')
		.pipe(uglify())
		.pipe(rename({
				suffix: '.min'
			})
		)
		.pipe(gulp.dest(path.js))
});

//Browser sync
gulp.task('browser-sync', ['styles'], function() {
	browserSync.init({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

// watch
gulp.task('watch', ['browser-sync', 'styles', 'scripts'], function() {
	gulp.watch(path.sass + '**/**/*.sass', ['styles']);
	gulp.watch(path.srcjs + '**/**/*.js', ['scripts']);
	gulp.watch(path.dist + '*.html').on('change', browserSync.reload);
	gulp.watch(path.css + '*.css').on('change', browserSync.reload);
});