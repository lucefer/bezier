var  webpack=require('webpack')
var path=require('path')
module.exports={
  entry:{
    index:'./src/animation.js'
  },
  output:{
    path:path.join(__dirname,'../dist'),
    filename:'bezier-animation.js',
    libraryTarget:'umd',
    library:'bezierAnimation'
  },
  plugins:[
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
