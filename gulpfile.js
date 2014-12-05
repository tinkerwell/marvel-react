var gulp = require('gulp');

var browserify = require('browserify');
//var del = require('del');
var reactify = require('reactify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
//var wiredep = require('wiredep').stream;
var mainBowerFiles = require('main-bower-files');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
//var connect = require('gulp-connect');
var rm = require('gulp-rimraf');
var filter = require('gulp-filter');
var inject = require('gulp-inject');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var minimist = require('minimist');
var url = require('url');
var nodemon = require('gulp-nodemon');
var proxy = require('proxy-middleware');
var srcDir = './src';
var devDir = './app';
var prodDir = './dist';

var targetDir = devDir;

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'development' }
};

var options = minimist(process.argv.slice(2), knownOptions);

var paths = {
  html : {
    src  : srcDir + '/index.html'
  },
  style : {
    src  : srcDir + '/css/*.sass',
    target : targetDir + "/css"
  },
  js: {
    name : 'main.js',
    src : srcDir + '/js/*',
    jsx : srcDir + '/jsx/*',
    target : targetDir + "/js"
  }
};

gulp.task('war', [ 'build' ], function(){

});


gulp.task('run',[ 'build', 'watch'], function () {
  var mtrUrl = "http://localhost:8080/api"
  var proxyOptions = url.parse( mtrUrl );
  proxyOptions.route = '/api';
  browserSync({
    server: {
      baseDir: targetDir,
      middleware : [proxy(proxyOptions)]
    }
  });
  nodemon({ script: 'server.js', ext: 'html js', ignore: ['ignored.js'] })
  .on('restart', function () {
    console.log('restarted!')
  })
});

// Rerun the task when a file changes
gulp.task('watch',  function() {
  gulp.watch(paths.html.src,  ['build', browserSync.reload]);
  gulp.watch(paths.style.src, ['style', browserSync.reload]);
  gulp.watch(paths.js.src,  ['main', browserSync.reload]);
  gulp.watch(paths.js.jsx,  ['main', browserSync.reload]);
});

gulp.task('clean', function() {
  return gulp.src( targetDir + "/*" )
   .pipe( rm ())
   .pipe( gulp.dest( targetDir ));
});

gulp.task('build', [ 'jsdep', 'cssdep', 'style','main' ],function () {
  var target = gulp.src(paths.html.src);
  var jquery = "jquery.js";
  if( options.env == "production"){
    jquery = "jquery.min.js";
    console.log( "html : " + options.env + " jquery : " + jquery  );
  }
  var imp = gulp.src(targetDir + "/js/" + jquery, {read: false});
  var sources = gulp.src([targetDir + "/js/*.js", "!" + targetDir + "/js/" + jquery, targetDir + "/css/*.css"], {read: false});
  return target
  .pipe(inject(imp,{starttag: '<!-- inject:head:{{ext}} -->', relative: true, ignorePath: ['../app/','../dist']}))
  .pipe(inject(sources, {relative: true, ignorePath: ['../app/','../dist']}))
  .pipe(gulp.dest( targetDir ));

});

gulp.task('jsdep', ['clean'],function(){
  var jsFilter = filter("*.js");
  return gulp.src(mainBowerFiles())
   .pipe( jsFilter )
   .pipe(gulpif(options.env === 'development', gulp.dest(targetDir + "/js")));
});


gulp.task('cssdep', ['clean'], function(){
  var cssFilter = filter("*.css");
  return gulp.src(mainBowerFiles())
  .pipe( cssFilter )
  .pipe(gulpif(options.env === 'development',gulp.dest(targetDir + "/css")));
});


gulp.task('main', ['clean'], function() {
  return browserify(srcDir + "/js/" + paths.js.name)
   .transform(reactify)
   .bundle()
   .pipe(source(paths.js.name))
   .pipe(gulpif(options.env === 'development', gulp.dest( targetDir + "/js")));
});


gulp.task('style',['clean'], function() {
  return gulp.src(paths.style.src)
  .pipe(sass({style:'expanded'}))
  .pipe(gulpif(options.env === 'development', gulp.dest(targetDir + "/css")));

});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['run'], function(){
  console.log( "default run");
});
