var  webpack=require('webpack')
var path=require('path')
var HtmlWebpackPlugin=require('html-webpack-plugin');
module.exports={
  entry:{
    raf:'./test/raf.test.js',
    animation:'./test/animation.test.js'
  },
  output:{
    path:path.join(__dirname,'../web-test'),
    filename:'[name].test.js'
  },
  plugins:[
  new HtmlWebpackPlugin({
    filename:'../web-test/index.html',
    title: '单元测试',
    template: './web-test/template.html',
    inject:false,
         chunks:['raf','animation']
  })
  ]

}
