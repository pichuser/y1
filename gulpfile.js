'use strict';
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var watch = require('gulp-watch');
var open = require('gulp-open');
var browserSync = require('browser-sync');
var inline = require('gulp-inline');
var rename = require('gulp-rename');


var paths = {
    html: ['src/index.html'],
    reloadBrowser: ['dist/**/index.html']
};
var port = 3000;
gulp.task('open', function(){
    var options = {
        uri: 'http://localhost:' + port + '/dist/index.html'
    };
    gulp.src('')
        .pipe(open(options));
});

gulp.task('connect', function() {
    return browserSync.init({
        port: port,
        open: false,
        directory: true,
        server: {
            baseDir: "./"
        },
        files: ['dist/css/index.css']
    },
    function(){
        gulp.run('open');
    });
});
gulp.task('copy_html', function(){
    return gulp.src(paths.html)
    .pipe(rename('index.dev.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('inline_css', ['copy_html', 'sass'], function(){
   return gulp.src('src/index.html')
       .pipe(inline({
           base: 'src/',
           disabledTypes: ['svg', 'img', 'js'],
           ignore: ['']}))
       .pipe(rename('index.html'))
        .pipe(gulp.dest('dist'))
});

gulp.task('reloadBrowser', function () {
    gulp.watch(paths.reloadBrowser, browserSync.reload);
});

gulp.task('watcher', function () {
    gulp.watch(paths.reloadBrowser, ['reloadBrowser']);
    gulp.watch('src/**/*.scss', ['inline_css']);
    gulp.watch(paths.html, ['inline_css']);
});

gulp.task('default', ['inline_css', 'connect',  'sass', 'watcher', 'copy_html']);


gulp.task('sass', function () {
    return gulp.src(['src/**/*.scss'])
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('index.css'))
        .pipe(sourcemaps.write('../../maps',{includeContent: false, sourceRoot: '/'}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/css'));
});