module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:7878', //对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
      hot:true,
      open : true,
      port : 8080,
      host : "127.0.0.1"
  }
}