import { resolve } from 'path'
import { globSync } from 'glob'
import mkcert from 'vite-plugin-mkcert'

const files = globSync(
    ['**/*.html', '**/*.css', '**/*.mjs'],
    { ignore: ['dist/**', 'node_modules/**', 'vite.config.ts*'] })
    .map((file) => resolve(__dirname, file))

const jsFiles = globSync('**/*.js', { ignore: ['dist/**', 'node_modules/**', 'vite.config.ts*'] })
if (jsFiles.length > 0) {
    throw new Error(`JavaScript files are not allowed in the web package: ${jsFiles.join(', ')}`)
}

/** @type {import('vite').UserConfig} */
export default {
    // config options
    server: { host: true, port: 443 },
    build: { rollupOptions: { input: files } },
    plugins: [mkcert({ hosts: ['local.back-in-real-life.com'] })],
}