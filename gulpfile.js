const gulp = require('gulp');
const eslint = require('gulp-eslint');
var files = ['./test/**/*test.js', './lib/**/*.js', 'gulpfile.js', 'index.js'];
gulp.task('lint', function() {
  return gulp.src(files)
  .pipe(eslint({
    'rules': {
      'indent': [2, 2]
    },
    'envs': [
      'mocha',
      'es6'
    ]
  }))
  .pipe(eslint.format());
});

gulp.task('watch', function() {
  gulp.watch(files, ['lint']);
});
