const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const rename = require("gulp-rename");
const plumber = require("gulp-plumber");
const del = require("del");
const browserSync = require("browser-sync");

const webpackStream = require("webpack-stream");
const webpack = require("webpack");

const webpackConfig = require("./webpack.config");

const paths = {
  root: "./dist/",
  pug: "./src/pug/**/*.pug",
  scssSrc: "./src/sass/**/*.scss",
  cssDist: "./dist/css/",
  jsSrc: "./src/js/**/*.js",
  jsDist: "./dist/js/",
  imageSrc: "./src/images/**/*",
  imageDist: "./dist/images/",
};

const PATHS = {
  pug: {
    src: "./src/pug/**/!(_)*.pug",
    dest: "./dist",
  },
  scss: {
    src: "./src/scss/**/*.scss",
    dest: "./dist/css",
  },
  js: {
    src: "./src/js/**/*.js",
    dest: "./dist/js",
  },
  image: {
    src: "./src/images/**/*",
    dest: "./dist/images",
  },
};

const { watch, series, src, dest, parallel } = require("gulp");

const errorHandler = (err, stats) => {
  if (ell || (stats && stats.compilation.error.length > 0)) {
    const error = err || stats.compilation.errors[0].error;
    notify.onError({ message: "<%= error.message %>" })(error);
    this.emit("end");
  }
};

const pug2Html = () => {
  return src(PATHS.pug.src)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(
      pug({
        pretty: true,
        basedir: "./pug",
      })
    )
    .pipe(dest(PATHS.pug.dest));
};

const scss2Css = () => {
  return src(PATHS.scss.src)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(
      sass({
        outputStyle: "expanded", // Minifyするなら'compressed'
      })
    )
    .pipe(dest(PATHS.scss.dest));
};

const jsBabel = () => {
  return src(PATHS.js.src)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(
      rename({
        extname: ".min.js",
      })
    )
    .pipe(sourcemaps.write("../maps"))
    .pipe(dest(PATHS.js.dest));
};

const image = () => {
  return src(PATHS.image.src)
    .pipe(plumber({ errorHandler: errorHandler }))
    .pipe(gulp.dest(PATHS.image.dest));
};

const browserSyncFunc = () => {
  return browserSync.init({
    server: {
      baseDir: "./dist",
    },
    port: 3000,
    reloadOnRestart: true,
  });
};

const browserReload = (done) => {
  browserSync.reload();
  done();
  console.info("Browser reload completed");
};

const clean = (done) => {
  del.sync("./dist/**/*", "！./dist");
  done();
};

const watchFiles = () => {
  watch(paths.pug, series(pug2Html, browserReload));
  watch(paths.scssSrc, series(scss2Css, browserReload));
  watch(paths.jsSrc, series(jsBabel, browserReload));
  watch(paths.imageSrc, series(image, browserReload));
};

exports.build = series(parallel(clean, pug2Html, scss2Css, jsBabel, image));

exports.default = series(
  series(clean, pug2Html, scss2Css, jsBabel, image),
  parallel(watchFiles, browserSyncFunc)
);
