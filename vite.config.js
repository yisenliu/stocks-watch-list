import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import { imagetools } from 'vite-imagetools';
import macrosPlugin from 'vite-plugin-babel-macros';
import myPackage from './package.json';
import mdPlugin from 'vite-plugin-markdown';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const root = resolve(__dirname, 'src');
const publicDir = resolve(__dirname, 'public');
const outDir = resolve(__dirname, 'dist');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // appType: 'mpa',
    // cssCodeSplit: false,
    base: './',
    build: {
      emptyOutDir: true,
      outDir,
      // modulePreload: false,
      rollupOptions: {
        input: {
          index: resolve(root, 'index.html'),
        },
      },
      sourcemap: true,
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
      'process.env.Breakpoints': myPackage.config.breakpoints,
      'process.env.SOME_KEY': env.VITE_SOME_KEY,
      'process.env.USER_ID': JSON.stringify(env.VITE_USER_ID), //string 使用 JSON.stringify()
    },
    envDir: process.cwd(),
    plugins: [
      react({
        babel: {
          babelrc: true,
        },
        jsxImportSource: '@emotion/react',
      }),
      macrosPlugin(),
      imagetools(),
      splitVendorChunkPlugin(),
      mdPlugin.plugin({
        mode: ['react'],
      }),
    ],
    publicDir,
    resolve: {
      alias: {
        '@': root,
        '@assets': resolve(root, 'assets'),
        '@components': resolve(root, 'components'),
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
      host: true,
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
        '/api/dayAvgPrice': {
          target: 'https://openapi.twse.com.tw',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/dayAvgPrice/, '/v1/exchangeReport/STOCK_DAY_AVG_ALL'),
        },
        '/api/eps': {
          target: 'https://openapi.twse.com.tw',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/eps/, '/v1/opendata/t187ap14_L'),
        },
      },
    },
  };
});
