import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-cpy';

import commoncfg from './rollup.config.common';

commoncfg[0].plugins.push(
  terser(),
  copy([
    {
      files: ['LICENSE', 'README.md'],
      dest: 'dist'
    }
  ])
);

export default commoncfg;
