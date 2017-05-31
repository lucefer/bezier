var bezier=require('./cubic-bezier')
var raf=require('./raf')
var Frame=require('./frame');
var FPS=60,interval=1/FPS;

/**
 * [bezierAnimation 给定参数，返回动画对象]
 * @method bezierAnimation
 * @param  {[type]}        duration             [动画时长]
 * @param  {[type]}        bezierTimingFunction [缓动函数]
 * @param  {[type]}        handlers             [帧渲染时的回调]
 * @param  {[type]}        delay                [动画延时]
 * @return {[type]}                             [description]
 */
function bezierAnimation(duration,bezierTimingFunction,handlers,delay){
  if(!this instanceof bezierAnimation){
    return new bezierAnimation(duration,bezierTimingFunction,handlers,delay);
  }
  var timingFunction=createBezier(bezierTimingFunction);
  var frameHandler;
  if (typeof handlers === 'function') {
    frameHandler=new Frame([handlers]);
  } else if (Object.prototype.toString.call(handlers) === '[object Array]'){
        frameHandler=new Frame(handlers);
  }
  if(!delay)delay=0;
  var isRunning=false,isDone=true,progress=0,startTime=0,passedTime=0,delayTimer=null;

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
/**
 * [createBezier description]
 * @method createBezier
 * @param  {[type]}     cubicBezierTiming [数组或者字符串]
 * @return {[type]}                       [返回对应的贝塞尔对象]
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
