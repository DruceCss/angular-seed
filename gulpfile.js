let gulp = require('gulp'),
    sass = require('gulp-sass'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    wiredep = require('gulp-wiredep'),
    notify = require("gulp-notify"),
    through = require('through2').obj,
    inlineAngularView = require('./node/gulp-inline-angular-view'),
    clean = require('gulp-clean'),
    gulpsync = require('gulp-sync')(gulp);

gulp.task('prod', gulpsync.sync(['bower', 'sass', 'clean', 'images', 'fonts']), function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.js', inlineAngularView('./app', ['vendor.js'])))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./dist'))
        .pipe(notify({message: 'Production ready', onLast: true}));
});

gulp.task('dev', ['sass', 'bower', 'watch']);

gulp.task('watch', ['sass:watch', 'bower:watch']);

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
        .pipe(notify({message: 'Bower ready', onLast: true}));
});

gulp.task('bower:watch', function () {
    gulp.watch('./bower.json', ['bower']);
});

gulp.task('images', function () {
    return gulp.src('./app/images/**/*.*')
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('fonts', function () {
    return gulp.src('./app/fonts/**/*.*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('clean', function () {
    return gulp.src('./dist/', {read: false})
        .pipe(clean());
});