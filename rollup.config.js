import typescript from 'rollup-plugin-typescript2'
import sourceMaps from 'rollup-plugin-sourcemaps'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const input = 'src/index.ts'
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]

export default [{
  // Non-minified umd and es outputs, including sourcemaps
  input,
  external,
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: pkg.name,
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({ typescript: require('typescript') }),
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
    typescript({ typescript: require('typescript') }),
    terser(),
  ],
}]
