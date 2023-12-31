import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { imagetools } from 'vite-imagetools';
import macrosPlugin from 'vite-plugin-babel-macros';
import mdPlugin from 'vite-plugin-markdown';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');
const publicDir = resolve(__dirname, 'public');
const outDir = resolve(__dirname, 'dist');

export default defineConfig(() => {
  return {
    appType: 'spa',
    base: process.env.GithubPages ? '/stocks-watch-list/' : '/',
    build: {
      emptyOutDir: true,
      outDir,
      rollupOptions: {
        input: {
          index: resolve(root, 'index.html'),
          404: resolve(root, '404.html'),
        },
        output: {
          chunkFileNames: 'assets/[name]-[hash].chunk.js',
        },
      },
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: `
          @use 'sass:math'
          @import 'src/sass/_abstracts.sass'
          @import 'src/sass/_global.sass'
          
        `,
        },
      },
    },
    define: {
      'process.env': process.env,
      corsProxy: JSON.stringify('https://corsproxy.io/?'),
    },
    envDir: process.cwd(),
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
      macrosPlugin(),
      imagetools(),
      splitVendorChunkPlugin(),
      mdPlugin.plugin({
        mode: ['html'],
      }),
    ],
    publicDir,
    resolve: {
      alias: {
        '@': root,
        '@assets': resolve(root, 'assets'),
        '@components': resolve(root, 'components'),
        '@markets': resolve(root, 'markets'),
        '@contexts': resolve(root, 'contexts'),
        '@hooks': resolve(root, 'hooks'),
        '@lib': resolve(root, 'lib'),
        '@routes': resolve(root, 'routes'),
        '@pages': resolve(root, 'pages'),
        '@sass': resolve(root, 'sass'),
        '@utils': resolve(root, 'utils'),
      },
    },
    root,
    server: {
      cors: true,
      host: true,
      open: false,
      proxy: {
        '/api/token': {
          target: 'https://api.finmindtrade.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/token/, '/api/v4/login'),
        },
        '/api/stock': {
          target: 'https://api.finmindtrade.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/stock/, '/api/v4/data'),
        },
        // 證交所API
        // '/api/dayAvgPrice': {
        //   target: 'https://openapi.twse.com.tw',
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/^\/api\/dayAvgPrice/, '/v1/exchangeReport/STOCK_DAY_AVG_ALL'),
        // },
        // '/api/eps': {
        //   target: 'https://openapi.twse.com.tw',
        //   changeOrigin: true,
        //   rewrite: path => path.replace(/^\/api\/eps/, '/v1/opendata/t187ap14_L'),
        // },
      },
    },
  };
});
