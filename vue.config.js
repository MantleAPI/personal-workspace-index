module.exports = {
    devServer: {
      open: true,
      host: 'localhost',
      port: 9810,
      https: false,
      proxy: {  //配置跨域
        '/biliApi': {
          target: 'https://api.bilibili.com/x/web-interface',
          changeOrigin: true,  //允许跨域
          ws: true,
          pathRewrite: {
              '^/biliApi': ''
          }
        },
        '/youdaoApi': {
          target: 'http://fanyi.youdao.com/',
          changeOrigin: true,  //允许跨域
          ws: true,
          pathRewrite: {
              '^/youdaoApi': ''
          }
        }
      }
    },
}