import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from "rollup-plugin-uglify";
import fs from 'fs';

/**
 * @returns {import('rollup').InputOption}
 */
function getFiles() {
    /**
     * @type {import('rollup').InputOption}
     */
    const fileOfBundles = {};
    /**
     * @type {string[]}
     */
    const PATH_TS_FILES = "./ts"
    const files = fs.readFileSync(PATH_TS_FILES);

    for (let file of files) {
        let name = file.split('.ts')[0];
        fileOfBundles[`${name + '.min'}`] = PATH_TS_FILES + file;
    }
    return fileOfBundles;
}
/** 
 * @type {import('rollup').RollupOptions}
 */
const config = {
    input: {
        "jogo.min": "./ts/jogo.ts"
    },
    output: {
        dir: './script',
        sourcemap: 'hidden',
        format: 'module',
        compact: true,
        esModule: true,
        strict: true,
        toplevel: true
    },
    plugins: [
        typescript(),
        commonjs(),
        uglify(),
    ]
}
export default config