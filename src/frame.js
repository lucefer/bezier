var raf=require('./raf')
function Frame(cb){
  var timer=null;
  this.execute=function(param,timingFunction){
    ///console.log("args",args);
    timer=raf(function(){

      param.progress=(param.passedTime+Date.now()-(!param.startTime?Date.now():param.startTime))/(param.duration*1000);
      if(param.progress>=1){
        param.progress=1;
      }
      for(var i=0,count=cb.length;i<count;i++){
        cb[i].call(null,param.progress.toFixed(6),timingFunction.solve(param.progress).toFixed(6));
      }
      frameOver();
    })
    return this;
  }
  var afterHandler;
  function frameOver(fun){
    afterHandler();
  }
  this.cancelRaf=function(){
    raf.cancel(timer)
  }
  this.then=function(cb){
    typeof cb ==='function' && (afterHandler=cb);
  }
}

module.exports=Frame;
