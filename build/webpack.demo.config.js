var  webpack=require('webpack')
var path=require('path')
module.exports={
  entry:{
    index:'./src/animation.js'
  },
  output:{
    path:path.join(__dirname,'../demo'),
    filename:'[name].js',
    libraryTarget:'umd',
    library:'bezierAnimation'
  },

}
