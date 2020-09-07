const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const del = require("del");
const browserSync = require("browser-sync");

const webpackStream = require("webpack-stream");
const webpack = require("webpack");

// webpackの設定ファイルの読み込み
const webpackConfig = require("./webpack.config");

//setting : paths
const paths = {
  root: "./dist/",
  pug: "./pug/**/*.pug",
  html: "./dist/**/*.html",
  cssSrc: "./sass/**/*.scss",
  cssDist: "./dist/css/",
  jsSrc: "./js/**/*.js",
  jsDist: "./dist/js/",
  imageSrc: "./images/**/*",
  imageDist: "./dist/images/",
};

const { watch, series, task, src, dest, parallel } = require("gulp");

//Pug
task("pug", function () {
  return src([paths.pug, "!./pug/**/_*.pug"])
    .pipe(
      pug({
        pretty: true,
        basedir: "./pug",
      })
    )
    .pipe(dest(paths.root));
});

//Sass
task("sass", function () {
  return src(paths.cssSrc)
    .pipe(
      sass({
        outputStyle: "expanded", // Minifyするなら'compressed'
      })
    )
    .pipe(dest(paths.cssDist));
});

//JavaScript(babel transpile and minify)
task("js", function () {
  return src(paths.jsSrc)
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(sourcemaps.write("../maps"))
    .pipe(dest(paths.jsDist));
});

//Image File
task("image", function () {
  return src(paths.imageSrc).pipe(gulp.dest(paths.imageDist));
});

// browser-sync
task("browser-sync", () => {
  return browserSync.init({
    server: {
      baseDir: paths.root,
    },
    port: 3000,
    reloadOnRestart: true,
  });
});

// browser-sync reload
task("reload", (done) => {
  browserSync.reload();
  done();
});

//watch
task("watch", (done) => {
  watch([paths.cssSrc], series("sass", "reload"));
  watch([paths.jsSrc], series("js", "reload"));
  watch([paths.jsSrc], series("webpack", "reload"));
  watch([paths.pug], series("pug", "reload"));
  watch([paths.imageSrc], series("image", "reload"));
  done();
});

//Clean
task("clean", function (done) {
  del.sync("./dist/**", "！./dist");
  done();
});

//Webpack
task("webpack", (done) => {
  return webpackStream(webpackConfig, webpack).pipe(gulp.dest("dist"));
});

task("build", parallel("pug", "sass", "js", "image", "clean", "webpack"));

task(
  "default",
  parallel(
    "watch",
    "browser-sync",
    "pug",
    "sass",
    "js",
    "image",
    "clean",
    "webpack"
  )
);
