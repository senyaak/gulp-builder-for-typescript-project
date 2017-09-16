var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var path = require('path');
var inject = require('gulp-inject');
var less = require('gulp-less');


var tsConfServer = {
  target: 'es6',
  module: 'commonjs',
  moduleResolution: 'node',
  noImplicitAny: false
};

var tsConfClient = {
  target: 'es6',
  moduleResolution: "node",
  noImplicitAny: false,
  out: 'test.js'
};

var tsProjectServer = ts.createProject('tsconfig.json', tsConfServer);
var tsProjectClient = ts.createProject('tsconfig.json', tsConfClient);

gulp.task('default', ['inject'], () => {
  return;
});

gulp.task('compile:server', ['clean'], () => {
  return gulp.src(['src/server/**/*.ts', 'typings/index.d.ts'])
    .pipe(ts(tsConfServer))
    .js.pipe(gulp.dest('built/server/'));
});
gulp.task('compile:client', ['compile:server'], () => {
  return gulp.src(['src/client/**/*.ts', 'typings/index.d.ts'])
  .pipe(ts(tsConfClient))
  .js.pipe(gulp.dest('built/client/'));
});

// gulp.task('watch', ['default'], function () {
//   server.listen({path: './built/server/app.js'});
//   gulp.watch(['./app.js'], server.restart);
//   var watcher = gulp.watch(
//     ['src/**/*', 'public/**/*'],
//     {debounceDelay: 1500},
//     ['server:restart'],
//     server.restart
//   );
//   watcher.on('change', function (event) {
//     console.log(`detected change in ${event.path}`);
//   });
// });
//
// gulp.task('server:restart', ['default'], function () {
//   server.restart(function () {});
// });

gulp.task('clean', () => {
  return gulp.src('built', {read: false})
    .pipe(clean({force: true}));
});

gulp.task('less', [ 'compile:client'], () => {
  return gulp.src('./src/**/*.less')
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(gulp.dest('./built/client'));
});

gulp.task('public', ['less'], () => {
  return gulp.src('./public/**/*')
    .pipe(gulp.dest('./built'));
});

gulp.task('inject', ['public'], () => {
  var target = gulp.src('./built/index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var sources = gulp.src(['./built/client/**/*.js', './built/**/*.css'], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./built'));
});
