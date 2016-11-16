var rollup = require('rollup').rollup;
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('rollup-plugin-uglify');
var postcss = require('rollup-plugin-postcss');
var gulp = require('gulp');
var autoprefixer = require('autoprefixer');

gulp.task('build', function () {
    rollup({
        entry: 'src/action-sheet.js',
        plugins: [
            nodeResolve({
                jsnext: true
            }),
            commonjs(),
            //uglify(),
            postcss({
                plugins: [
                    autoprefixer()
                ],
                extensions: ['.css'],
            })
        ]
    }).then(function (bundle) {
        bundle.write({
            dest: 'build/action-sheet.js',
            moduleName: 'ActionSheet',
            format: 'umd'
        });
    }).catch(function (err) {
        console.log(err);
    });
})

gulp.task('watch', function () {
    gulp.watch(['src/*.js', 'lib/*js'], ['build']);
})