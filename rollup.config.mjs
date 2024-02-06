import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: './jsbox-component/index.js',
  output: {
    format: 'cjs',
    file: 'component.js',
  },
  plugins: [
    resolve(),
    commonjs()
  ]
}
