const gulp = require("gulp");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
var jsonConcat = require('gulp-json-concat');
var file = require('gulp-file');

gulp.task("scripts", () => {
  gulp
    .src(["app/*.js"])
    .pipe(
      babel({
        presets: ["env"]
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest("dist"));
});
// Copy other files
gulp.task("copy", () => {
  gulp.src("app/*.css").pipe(gulp.dest("dist"));
  gulp.src("app/*.html").pipe(gulp.dest("dist"));
  gulp.src("app/assets/**/*").pipe(gulp.dest("dist/assets"));
});

// gulp.task('split-json', function() {
//   var str = primus.library();
//   return gulp.src('data/radar-data.json')
//     .pipe(file('primus.js', str))
//     .pipe(gulp.dest('datacopy1'));
// });

// concat JSON files
gulp.task('merge-json',  () => {
   gulp.src('contribute/*.json')
    .pipe(jsonConcat('radar-data-copy2.json', function (data) {
      // console.log(data);
      // console.log(JSON.stringify(entries));
      var finalObj = {};
      finalObj.entries = Object.values(data);
      return new Buffer(JSON.stringify(finalObj));
    }))
    .pipe(gulp.dest('datacopy/'));
});

gulp.task("copy-data", () => {
  gulp.src("data/*.json").pipe(gulp.dest("functions/data"));
});

gulp.task("default", ["scripts", "copy", "merge-json", "copy-data"], () => {});