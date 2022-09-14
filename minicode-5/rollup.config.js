import sucrase from '@rollup/plugin-sucrase';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";
import commonjs from '@rollup/plugin-commonjs';

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: './index/index.ts',
    treeshake: true,
    output: {
      format: 'esm',
      file: './index/index.js'
    },
    plugins: [
      resolve({ extensions: ['.ts', '.js'] }),
      commonjs(),
      production && terser(),
      sucrase({
        transforms: ['typescript']
      })
    ]
  }
]