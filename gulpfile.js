var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync').create(), // синхронизация браузеров и live-reload
	sass = require('gulp-sass'), // компиляция sass
	concat = require('gulp-concat'), // конкатенация
	rename = require('gulp-rename'), // сокращение свойств css
	csso = require('gulp-csso'), // сжатие css
	gcmq = require('gulp-group-css-media-queries'), // группирование media
	uglify = require('gulp-uglify'), // сжатие JS
	sourcemaps = require('gulp-sourcemaps'), // карта
	deletefile = require('gulp-delete-file'); // удаление файлов

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
	return gulp.src(path.sass + 'inc.sass')
		.pipe(sass({importer: require('npm-sass').importer}).on('error', sass.logError))
		.pipe(rename({
				basename: 'styles',
			})
		)
		.pipe(autoprefixer({browsers: ['last 50 versions'], cascade: false}))
		.pipe(gcmq())
		.pipe(gulp.dest(path.css))
		.pipe(browserSync.stream());
});

//scripts
gulp.task('scripts', function() {
	return gulp.src(path.srcjs + '*.js')
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
gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {
	gulp.watch(path.sass + '**/**/**/**/**/**/**/**/*.sass', ['styles']);
	gulp.watch(path.sass + '**/**/**/**/**/**/**/**/*.scss', ['styles']);
	gulp.watch(path.srcjs + '**/**/**/**/**/**/**/*.js', ['scripts']);
	gulp.watch(path.dist + '*.html').on('change', browserSync.reload);
	gulp.watch(path.css + '*.css').on('change', browserSync.reload);
	gulp.watch(path.js + '*.js').on('change', browserSync.reload);
});
//minify css
gulp.task('minifyCSS', ['styles'], function() {
	return gulp.src(path.css + '*.css')
		.pipe(sourcemaps.init())
		.pipe(csso())
		.pipe(rename({
				basename: 'styles',
				suffix: '.min'
			})
		)
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.css));
});
// minify js
gulp.task('minifyJS', ['scripts'], function() {
	return gulp.src(path.js + '*.js')
		.pipe(uglify())
		.pipe(rename({
				suffix: '.min'
			})
		)
		.pipe(gulp.dest(path.js))
});

gulp.task('deletefile', function () {
	var regexp = /\w*(\-\w{8}\.js){1}$|\w*(\-\w{8}\.css){1}$/;
	gulp.src([path.js + '*.min.js', path.css + '*.min.css', path.css + '*.min.css.map'])
		.pipe(deletefile({
			reg: regexp,
			deleteMatch: false
		}));
});
// minify all
gulp.task('minify', ['deletefile', 'minifyCSS', 'minifyJS']);

