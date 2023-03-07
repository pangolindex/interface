import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [svgr(), react()],
    define: {
      'process.env': {}
    },
    resolve: {
      alias: {
        // here we are mapping "src" because in components we have absolute path that starts with "src"
        src: path.resolve(__dirname, './src')
      }
    },
    build: {
      commonjsOptions: { transformMixedEsModules: true, include: [] }
    },
    optimizeDeps: {
      // this is needed because of js-sha256 & near-api-js library
      // @see https://github.com/near/near-api-js/issues/1035
      disabled: false,
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true
          })
        ]
      }
    }
  })
}
