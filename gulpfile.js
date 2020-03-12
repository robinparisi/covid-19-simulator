const gulp = require('gulp')
const Gulpy = require('@agence-webup/gulpy')

// config
const gulpy = new Gulpy({
  publicFolder: 'public',
  manifest: 'public/rev-manifest.json',
  npmManifest: 'public/npm-manifest.json'
})

// tasks
const clean = gulpy.clean(['public/**'])
const sass = gulpy.sass('src/sass/style.scss', 'public/css')
const js = gulpy.js('src/js/*.js', 'public/js')
const copyNpm = gulpy.copyNpm('public/node_modules')
const copy = gulpy.copy('src/*.html', 'public')
gulpy.addWatch(['src/*.html'], copy)

// export
exports.default = gulp.series(clean, gulp.series(sass, js, copy, copyNpm))
exports.watch = gulpy.watch()
