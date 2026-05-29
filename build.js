const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/index.js'],
  bundle: true,
  minify: true,
  sourcemap: false,
  outfile: 'dist/plugin.js',
  format: 'iife',
  target: ['es5'],
};

if (isWatch) {
  esbuild.context(buildOptions).then(ctx => {
    ctx.watch();
    console.log('Watching for changes...');
  });
} else {
  esbuild.build(buildOptions).then(() => {
    console.log('Build complete: dist/plugin.js');
  }).catch(() => process.exit(1));
}
