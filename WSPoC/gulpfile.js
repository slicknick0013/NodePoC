'use strict';

var gulp         = require('gulp'),
    include      = require('gulp-file-include'),
    htmlmin      = require('gulp-minify-html'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss    = require('gulp-minify-css'),
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    svgmin       = require('gulp-svgmin'),
    rename       = require('gulp-rename'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    livereload   = require('gulp-livereload'),
    del          = require('del'),
    connect      = require('gulp-connect');

gulp.task('include', function () {
    return gulp.src('src/**/*.html')
        .pipe(include({
            prefix: '@@',
            basepath: 'src'
        }))
        .pipe(gulp.dest('build'))
        .pipe(notify({message: 'Include task complete'}));
});

gulp.task('htmlmin', function () {
    var opts = {
        comments: false,
        quotes: true,
        spare: true
    };

    return gulp.src('build/views/**/*.html')
        .pipe(htmlmin(opts))
        .pipe(gulp.dest('dist'))
        .pipe(notify({message: 'HTMLmin task complete'}));
});

gulp.task('styles', function () {
    return sass('src/assets/sass/main.scss', {
        defaultEncoding: 'UTF-8',
        lineNumbers: true,
        precision: 10,
        require: 'susy',
        style: 'expanded'
    })
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('dist/assets/styles'))
        .pipe(autoprefixer())
        .pipe(notify({message: 'Styles task complete'}));
});

gulp.task('scripts', function () {
    return gulp.src('src/assets/js/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/assets/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('images', function () {
    return gulp.src('src/assets/img/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/assets/img'))
        .pipe(notify({message: 'Images task complete'}));
});

gulp.task('svg', function () {
    return gulp.src('src/assets/svg/**/*')
        .pipe(cache(svgmin()))
        .pipe(gulp.dest('dist/assets/svg'))
        .pipe(notify({message: 'SVG task complete'}));
});

gulp.task('serve', function() {
    connect.server({
        root: 'dist/'
    });
});

gulp.task('clean', function(cb) {
    del(['build', 'dist'], cb)
});

gulp.task('default', function () {
    gulp.start('include', 'htmlmin', 'styles', 'scripts', 'images', 'svg');
});

gulp.task('watch', function() {

    // Watch .html files
    gulp.watch('src/views/**/*.html', ['include']);
    gulp.watch('build/**/*.html', ['htmlmin']);

    // Watch .scss files
    gulp.watch('src/assets/sass/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/assets/js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/assets/img/**/*', ['images']);
});