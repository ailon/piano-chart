import commoncfg from './rollup.config.common';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-cpy';
import staticSite from 'rollup-plugin-static-site';

commoncfg[0].plugins.push(
  staticSite({
    template: { path: 'dev-assets/template.html' },
    dir: 'dist'
  }),
  copy({
    files: ['dev-assets/*.js'],
    dest: 'dist'
  }),
  serve('dist'),
  livereload()
);

export default commoncfg;
