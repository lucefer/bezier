var bezier=require('./cubic-bezier')
var raf=require('./raf')
var Frame=require('./frame');
var FPS=60,interval=1/FPS;
function bezierAnimation(duration,bezierTimingFunction,handlers,delay){
  var timingFunction=createBezier(bezierTimingFunction);
  var frameHandler;
  if (typeof handlers === 'function') {
    frameHandler=new Frame([handlers]);
  } else if (Object.prototype.toString.call(handlers) === '[object Array]'){
        frameHandler=new Frame(handlers);
  }
  if(!delay)delay=0;
  var isRunning=false;
  var isDone=true;
  var progress=0;
  var startTime=0;
  var passedTime=0;
  var delayTimer=null;
  this.play=function(){
    if(!startTime)startTime=Date.now();
    if(isRunning)return;
    if(isDone)isDone=false;
    isRunning=true;
    function playCurrFrame(){
      progress=(passedTime+Date.now()-startTime)/(duration*1000);
      if(progress>=1){
        progress=1;
      }
      frameHandler.execute(progress.toFixed(6),timingFunction.solve(progress).toFixed(6)).then(function(){
        //frameIndex++;
        //console.log(frameIndex++);
        playNext();
      })
    }
    function done(){
      isRunning=false;
      isDone=true;
      passedTime=0;
      startTime=0;
      progress=0;
      delayTimer=null;
      for(var i=0,count=endCb.length;i<count;i++){
        endCb[i]();
      }
    }
    function playNext(){
      if(!isRunning)return;
      if(progress>=1){
        done();
      }else {
        playCurrFrame();
      }
    }
    if(!delay){
      playCurrFrame();
    }else{
      if(!delayTimer){
        delayTimer=setTimeout(function(){startTime=Date.now();playCurrFrame();},delay*1000);
      }else{
        playCurrFrame();
      }
    }
  }
  this.stop=function(){
  passedTime=Date.now()-startTime;
  startTime=0;
    isRunning=false;
  }
  this.isRunning=function(){
    return isRunning;
  }
  this.isDone=function(){
    return isDone;
  }
  this.isStopped=function(){
    return !isDone && !isRunning
  }
  var endCb=[];
  this.end=function(cb){
    endCb.push(cb);
  }
}
bezierAnimation.RUNNING="running"
bezierAnimation.STOPPED="stopped"
bezierAnimation.DONE="done";
/**
 * [createBezier description]
 * @method createBezier
 * @param  {[type]}     cubicBezierTiming [形如"0.1，0.1，1，1"的字符串]
 * @return {[type]}                       [description]
 */
function createBezier(cubicBezierTiming){
  if(typeof cubicBezierTiming === 'string'){
    if(bezier[cubicBezierTiming]){
      return bezier[cubicBezierTiming];
    }
    console.error("未找到预置的贝塞尔函数");
    return;
  }
  else if(Object.prototype.toString.call(cubicBezierTiming) === '[object Array]' && cubicBezierTiming.length === 4){
    return new bezier(cubicBezierTiming[0],cubicBezierTiming[1],cubicBezierTiming[2],cubicBezierTiming[3]);
    console.error("贝塞尔参数应为四个介于【0，1】之间的数值");
  }else if(typeof cubicBezierTiming === 'function' && cubicBezierTiming instanceof bezier){
    return cubicBezierTiming;
  }

}
module.exports=bezierAnimation;
