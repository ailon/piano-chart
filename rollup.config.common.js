import pkg from './package.json';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';
import generatePackageJson from 'rollup-plugin-generate-package-json';
import resolve from '@rollup/plugin-node-resolve';

const outputDir = './dist/';

const leanPkg = Object.assign({}, pkg);
leanPkg.scripts = {};
leanPkg.devDependencies = {};

const banner = `/* **********************************
Piano Chart v.${pkg.version}

copyright Alan Mendelevich
see README.md and LICENSE for details
********************************** */`;

export default [
  {
    input: 'src/index.ts',
    plugins: [
      resolve(),
      del({ targets: 'dist/*' }),
      typescript({
        clean: true,
        useTsconfigDeclarationDir: true
      }),
      generatePackageJson({
        baseContents: leanPkg
      })
    ],
    output: [
      {
        file: outputDir + pkg.module,
        format: 'es',
        banner: banner
      },
      {
        file: outputDir + pkg.main,
        name: 'pianoChart',
        format: 'umd',
        sourcemap: true,
        banner: banner
      }
    ]
  }
];
