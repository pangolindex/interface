import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react(), svgr()],
    define: {
      'process.env': {
        NODE_ENV: 'production'
      }
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
        maxParallelFileOps: 100,
        // Define manualChunks to create custom chunks
        onwarn: function(message, defaultHandler) {
          if (message.code === 'EVAL') return
          defaultHandler(message)
        },
        output: {
          manualChunks: {
            'styled-components': ['styled-components'],
            'react-query': ['react-query'],
            axios: ['axios'],
            '@ethersproject': [
              '@ethersproject/abi',
              '@ethersproject/address',
              '@ethersproject/bignumber',
              '@ethersproject/constants',
              '@ethersproject/contracts',
              '@ethersproject/experimental',
              '@ethersproject/providers',
              '@ethersproject/strings',
              '@ethersproject/wallet',
              '@ethersproject/units',
              'ethers'
            ],
            '@hashgraph': ['@hashgraph/sdk', '@hashgraph/hethers'],
            '@pangolindex_sdk': ['@pangolindex/sdk'],
            '@honeycomb-finance_wallet-connectors': ['@honeycomb-finance/wallet-connectors'],
            '@honeycomb-finance_shared': ['@honeycomb-finance/shared'],
            '@honeycomb-finance_state_hooks': ['@honeycomb-finance/state-hooks']
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
