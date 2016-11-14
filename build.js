var rollup = require('rollup').rollup;
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var uglify = require('rollup-plugin-uglify');
var postcss = require('rollup-plugin-postcss');

rollup({
  entry: 'src/pushbutton.js',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    commonjs(),
    //uglify(),
    postcss({
      extensions: ['.css'],
    })
  ]
}).then(function (bundle) {
  bundle.write({
    dest: 'build/pushbutton.min.js',
    moduleName: 'Pushbutton',
    format: 'umd'
  });
});