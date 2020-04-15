const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const pump = require("pump");
const autoprefixer = require("gulp-autoprefixer");
const htmlmin = require("gulp-htmlmin");
const handlebars = require("gulp-compile-handlebars");
const rename = require("gulp-rename");
const prettify = require("gulp-html-prettify");
const concat = require("gulp-concat");
const stripDebug = require("gulp-strip-debug");
const wait = require("gulp-wait");

function compileMarkup() {
  var options = {
    ignorePartials: false, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ["templates/partials"],
  };
  return gulp
    .src("templates/*.hbs")
    .pipe(handlebars(null, options))
    .pipe(prettify({ indent_char: " ", indent_size: 2 }))
    .pipe(
      rename(function (path) {
        path.extname = ".html";
      })
    )
    .pipe(gulp.dest("public"));
}

function compileScript() {
  return pump([gulp.src("js/**/*.js"), gulp.dest("public/js/")]);
}

function compileStyle() {
  return gulp
    .src("scss/main.scss")
    .pipe(wait(1500))
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false,
      })
    )
    .pipe(gulp.dest("public/css"));
}

gulp.task("compile", gulp.series(compileMarkup, compileScript, compileStyle));

// const compile = gulp.parallel(compileMarkup, compileScript, compileStyle);
// compile.description = "compile all sources";

// Not exposed to CLI
function startServer() {
  browserSync.init({
    server: "./app",
  });
}

// gulp.task("startServer", startServer);
gulp.task("serve", gulp.series("compile"));

// const serve = gulp.series(compile, startServer);
// serve.description = "serve compiled source on local server at port 3000";

// const watch = gulp.parallel(watchMarkup, watchScript, watchStyle);
// watch.description = "watch for changes to all source";

// const defaultTasks = gulp.parallel(serve);
gulp.task("build", gulp.series("serve"));

// export {
//   compile,
//   compileMarkup,
//   compileScript,
//   compileStyle,
//   serve,
//   watch,
//   watchMarkup,
//   watchScript,
//   watchStyle,
// };

// export default defaultTasks;
