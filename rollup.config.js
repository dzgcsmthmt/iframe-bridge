import {terser} from 'rollup-plugin-terser';

export default {
    input: 'src/index.js',
    output: {
        name: 'iframeBridge',
        file: 'dist/main.js',
        format: 'esm'
    },
    plugins: [
        terser()
    ]

}