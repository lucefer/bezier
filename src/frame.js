var raf=require('./raf')
function Frame(cb){
  this.execute=function(){
    var args=arguments,isCanceled=false;
    ///console.log("args",args);
    raf(function(){
      if(isCanceled)return;
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
  this.cancel=function(){
    isCanceled=true;
  }
}

module.exports=Frame;
