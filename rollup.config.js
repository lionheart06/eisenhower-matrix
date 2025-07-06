import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/eisenhower-matrix.min.js',
    format: 'iife',
    name: 'EisenhowerMatrix',
    banner: '/* Eisenhower Matrix - https://github.com/lionheart06/eisenhower-matrix */'
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
      declarationMap: false,
      outDir: undefined
    }),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        reserved: ['EisenhowerMatrix', 'DraggableMatrix', 'LocalStorageAdapter']
      }
    })
  ]
};