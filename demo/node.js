var bezier=require('bezier-animation')
var ani=new bezier(2,'linear',function(i1,i2){
  console.log("i1",i1,i2);
})
ani.play();
