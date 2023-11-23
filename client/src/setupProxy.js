const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/res', {
      target: 'http://127.0.0.1:7002',
      changeOrigin: true
    }),
    createProxyMiddleware('/api', {
      target: 'http://127.0.0.1:7002',
      changeOrigin: true
    }),
    createProxyMiddleware('/static', {
      target: 'http://127.0.0.1:7002',
      changeOrigin: true
    })
  )
}
