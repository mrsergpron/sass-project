const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat");
const gulpIf = require("gulp-if");
const sass = require("gulp-sass");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const watch = require("gulp-watch");
const browserSync = require("browser-sync").create();

const Develop = false;

//задачи
gulp.task("scss", function (callback) {
  return gulp
    .src("./src/**/*.scss")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Scss",
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(gulpIf(Develop, sourcemaps.init()))
    .pipe(sass())
    .pipe(concat("./bundle.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 4 versions"],
      })
    )
    .pipe(gulpIf(!Develop, cleanCss()))
    .pipe(gulpIf(Develop, sourcemaps.write()))
    .pipe(gulp.dest("./public"))
    .pipe(browserSync.stream());
  callback();
});

gulp.task("html", function (callback) {
  return gulp
    .src("./src/index.html")
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: "Html",
            sound: false,
            message: err.message,
          };
        }),
      })
    )
    .pipe(gulp.dest("./public"))
    .pipe(browserSync.stream());
  callback();
});

//Следим за файлами html  и css
gulp.task("watch", function () {
  //Делаем задержку в 1 секунду, если проект находится на HDD диске, а не на SSD диске
  watch("./src/**/*.scss", function () {
    setTimeout(gulp.parallel("scss"), 1000);
  });
  watch("./src/index.html", function () {
    setTimeout(gulp.parallel("html"), 1000);
  });
});

//Задача для старта сервера из папки public
gulp.task("server", function () {
  browserSync.init({ server: { baseDir: "./public" } });
});

//Дефолтный таск, запускаем одновременно сервер и слежение
gulp.task(
  "default",
  gulp.series(gulp.parallel("scss", "html"), gulp.parallel("server", "watch"))
);
