import resolve from '@rollup/plugin-node-resolve';
import ts from '@wessberg/rollup-plugin-ts';
import sourceMaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const input = 'src/index.ts';
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

export default [{
  // Non-minified umd output, including sourcemaps and declarations
  input,
  external,
  output: [{
    file: pkg.main,
    format: 'umd',
    name: pkg.name,
    sourcemap: true,
  }],
  plugins: [
    resolve(),
    ts({ tsconfig: (cfg) => ({ ...cfg, declaration: true, declarationMap: true }) }),
    sourceMaps(),
  ],
}, {
  // Non-minified es output, including sourcemap
  input,
  external,
  output: [{
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  }],
  plugins: [
    resolve(),
    ts(),
    sourceMaps(),
  ],
}, {
  // Minified output using terser
  input,
  external,
  output: [{
    file: pkg.min,
    format: 'umd',
    name: pkg.name,
  }],
  plugins: [
    resolve(),
    ts(),
    terser(),
  ],
}];
