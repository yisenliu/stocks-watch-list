const express = require('express');
const path = require('path');
const port = '3000';
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// proxy
app.use(
  '/api/token',
  createProxyMiddleware({
    target: 'https://api.finmindtrade.com',
    pathRewrite: { '^/api/token': '/api/v4/login' },
    changeOrigin: true,
  }),
);
app.use(
  '/api/stock',
  createProxyMiddleware({
    target: 'https://api.finmindtrade.com',
    pathRewrite: { '^/api/stock': '/api/v4/data' },
    changeOrigin: true,
  }),
);

// Handles any requests that don't match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});
app.listen(port);

console.log(`Server running at http://localhost:${port}/`);
