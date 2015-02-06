
// include gulp & gulp-debug
var gulp = require('gulp');
var debug = require('gulp-debug');

// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var chmod = require('gulp-chmod');

src = "./src/";
dst = "./www/";

// JS hint
gulp.task('jshint', function() {
  gulp.src(src + "js/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  gulp.src(src + "img/*.png")
    .pipe(changed(dst + "img"))
    .pipe(imagemin())
    .pipe(gulp.dest(dst + "img"));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  gulp.src([src + "**/*.html", src + "views/*.svg"], {base: src})
    .pipe(changed(dst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(dst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
    gulp.src([
        src + "vendor/angular.js",
        src + "main.js",
        src + "views/*.js"
    ], { base: src })
    .pipe(concat('main.js'))
    // .pipe(gulp.dest(dst))
    .pipe(stripDebug())
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(chmod(664))
    .pipe(gulp.dest(dst));
});

// Preprocess Sass, concat all, autoprefix and minify
gulp.task('styles', function () {
    gulp.src(src + 'scss/*.scss')
        .pipe(sass())
        .pipe(concat('main.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(gulp.dest(dst + "css"));
});

// just pipe the assets to the dst
gulp.task("assets", function() {
    gulp.src([src + "video/*.cut.*", src + "test/*.min.json"], {base: src})
      .pipe(gulp.dest(dst));
});

// default gulp task
gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles', 'assets'], function() {
  // watch for HTML changes
  gulp.watch(src + '**/*.html', function() {
    gulp.run('htmlpage');
  });

  // watch for JS changes
  gulp.watch(src + '**/*.js', function() {
    gulp.run('jshint', 'scripts');
  });

  // watch for CSS changes
  gulp.watch(src + '**/*.scss', function() {
    gulp.run('styles');
  });
});
