var gulp = require('gulp'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    wiredep = require('gulp-wiredep'),
    notify = require("gulp-notify"),
    through = require('through2').obj,
    inlineAngularView = require('./node/gulp-inline-angular-view');

gulp.task('prod', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.js', inlineAngularView('./app', ['vendor.js'])))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./dist'))
        .pipe(notify({message: 'Production ready', onLast: true}))
});

gulp.task('sass', function () {
    return gulp.src('./app/sass/app.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./app'))
        .pipe(notify({message: 'SASS ready', onLast: true}));
});

gulp.task('sass:watch', function () {
    gulp.watch('./app/sass/**/*.sass', ['sass']);
});

gulp.task('bower', function () {
    gulp.src('./app/index.html')
        .pipe(wiredep({
            directory: "app/bower_components"
        }))
        .pipe(gulp.dest('./app'))
});

gulp.task('test', function () {
    iav('./dist', './app', [
        // ignore from root
        'bower_components',
        'vendor.js'
    ]);
});