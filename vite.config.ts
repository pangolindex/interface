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
        src: path.resolve(__dirname, './src'),
        // refer https://github.com/vitejs/vite/issues/9511#issuecomment-1203555842
        stream: 'rollup-plugin-node-polyfills/polyfills/stream' // add stream
      }
    },
    build: {
      commonjsOptions: { transformMixedEsModules: true, include: [] },
      rollupOptions: {
        // Define manualChunks to create custom chunks
        output: {
          manualChunks: {
            // Here, we're creating a chunk named 'lodash' that includes only 'lodash' module.
            shared: ['@honeycomb-finance/shared'],
            state_hooks: ['@honeycomb-finance/state-hooks'],
            wallet_connectors: ['@honeycomb-finance/wallet-connectors']
            // You can create additional chunks and specify the modules to include in each chunk.
          }
        }
      }
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
