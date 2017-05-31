var raf=require('./raf')
function Frame(cb){
  this.execute=function(){
    var args=arguments
    ///console.log("args",args);
    raf(function(){
      for(var i=0,count=cb.length;i<count;i++){
        cb[i].apply(null,args);
      }
      frameOver();
    })
    return this;
  }
  var afterHandler;
  function frameOver(fun){
    afterHandler();
  }
  this.then=function(cb){
    typeof cb ==='function' && (afterHandler=cb);
  }
}

module.exports=Frame;
