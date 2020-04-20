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
const babel = require("gulp-babel");
const util = require("gulp-util");
require("@babel/polyfill");

let config = {
  dir: "app",
};

console.log(util.env.production ? "Production Mode" : "Develop Mode");

if (util.env.production) {
  config.dir = "public";
}

function compileMarkup() {
  var options = {
    ignorePartials: false, //ignores the unknown footer2 partial in the handlebars template, defaults to false
    batch: ["templates/partials"],
  };
  return gulp
    .src("templates/*.hbs")
    .pipe(handlebars(null, options))
    .pipe(
      rename(function (path) {
        path.extname = ".html";
      })
    )
    .pipe(
      util.env.production
        ? prettify({ indent_char: " ", indent_size: 2 })
        : util.noop()
    )
    .pipe(
      util.env.production ? htmlmin({ collapseWhitespace: true }) : util.noop()
    )
    .pipe(gulp.dest(config.dir));
}

function compileScript() {
  return pump([gulp.src("js/**/*.js"), gulp.dest(config.dir + "/js/")]);
}

function uglifyScript() {
  return gulp
    .src(config.dir + "/js/*.js")
    .pipe(
      babel({
        presets: ["env"],
      })
    )
    .pipe(uglify())
    .pipe(stripDebug())
    .pipe(gulp.dest(config.dir + "/js"));
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
    .pipe(gulp.dest(config.dir + "/css"))
    .pipe(browserSync.stream());
}

function compileAssets() {
  return pump([gulp.src("assets/**"), gulp.dest(config.dir + "/assets/")]);
}

function startServer(done) {
  browserSync.init({
    server: "./app",
    port: 3000,
    reloadDelay: 1000,
    ghostMode: false,
    notify: false,
    open: false,
  });
  done();
}

function watchFiles() {
  gulp.watch("templates/**/*.hbs", compileMarkup);
  gulp.watch("js/**/*.js", compileScript);
  gulp.watch("scss/**/*.scss", compileStyle);
  gulp.watch(config.dir + "/*.html").on("change", browserSync.reload);
  gulp.watch(config.dir + "/js/**/*.js", browserSync.reload);
  gulp.watch(config.dir + "app/css/**/*.css", browserSync.reload);
}

gulp.task(
  "compile",
  gulp.series(
    startServer,
    compileMarkup,
    compileScript,
    compileStyle,
    compileAssets,
    watchFiles
  )
);

gulp.task(
  "prod",
  gulp.series(compileMarkup, compileScript, compileStyle, compileAssets)
);

gulp.task("serve", gulp.series("compile"));
gulp.task("build", gulp.series("prod"));
