var gulp = require('gulp'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        sass = require('gulp-ruby-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        browserSync = require('browser-sync').create(),
        del = require('del'),
        imagemin = require('gulp-imagemin'),
        inject = require('gulp-inject'),
        es = require('event-stream'),
        angularFilesort = require('gulp-angular-filesort'),
        series = require('stream-series');

var child = require('child_process');
var fs = require('fs');


gulp.task('server', function () {
    var server = child.spawn('node', ['services/www']);
    var log = fs.createWriteStream('server.log', {flags: 'a'});
    server.stdout.pipe(log);
    server.stderr.pipe(log);
});

gulp.task('watch', function() {
//  gulp.watch("source/**/*", ['admin_index_file']);
});

gulp.task('default', ['watch','server']);


gulp.task('clean', function () {
    return del(['application/admin/*.js']);
});



var ADMIN_PATH ={
    
};



