(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["bezierAnimation"] = factory();
	else
		root["bezierAnimation"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var prefixVendors=['moz','webkit'],mainName='AnimationFrame',top=global?global:window;
var raf=top['request'+mainName],_raf=raf,caf=top['cancel'+mainName]||top['cancelRequest'+mainName],_caf=caf;
if(!raf){
  for(var i=0;i<prefixVendors.length;i++){
    raf=top[prefixVendors[i]+'Request'+mainName];
    caf=top[prefixVendors[i]+'Cancel'+mainName] || top[prefixVendors+'CancelRequest'+mainName];
  }
}

if(!raf||!caf){
  var l=0,id=0,handlerQuene=[],
  frameInterval=1000 / 60;
  raf=function(callback){
    if(handlerQuene.length == 0){
      var n=Date.now(),
      e=Math.max(0,frameInterval-n+l);
      var next=l==0?Math.round(frameInterval):Math.round(e);
      l=n+Math.round(e);
      setTimeout(function(){
        var c=handlerQuene.slice(0);
        (handlerQuene.length>0) && (handlerQuene=[]);
        for(var i=0,count=c.length;i<count;i++){
            try{
              if(!c[i].canceled)
              {
                c[i].callback(l);
              }
            }
            catch(e){
              setTimeout(function(){throw e});
            }
        }
      },next);
    }
    handlerQuene.push({
      id:++id,
      callback:callback,
      canceled:false
    })

    return id;
  }
  caf=function(tickId){
    for(var i=0,count=handlerQuene.length;i<count;i++){
      if(handlerQuene[i].id===tickId){
        handlerQuene[i].canceled=true;
      }
    }
  }
}


module.exports=function(fn){
  return raf.call(top,fn);
}
module.exports.cancel=function(){
  caf.apply(top,arguments);
}
module.exports.polyfill=function(){
  top.requestAnimationFrame=raf;
  top.cancelAnimationFrame=caf;
}
module.exports.unPolyfill=function(){
  top.requestAnimationFrame=_raf;
  top.cancelAnimationFrame=_caf
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3)))

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function CubicBezier(p1x, p1y, p2x, p2y) {
    this.cx = 3.0 * p1x;
    this.bx = 3.0 * (p2x - p1x) - this.cx;
    this.ax = 1.0 - this.cx - this.bx;

    this.cy = 3.0 * p1y;
    this.by = 3.0 * (p2y - p1y) - this.cy;
    this.ay = 1.0 - this.cy - this.by;
}
var p = CubicBezier.prototype;
p.sampleCurveX = function(t) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
}
p.sampleCurveY = function(t) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
}
p.sampleCurveDerivativeX = function(t) {
    return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx;
}
// Given an x value, find a parametric value it came from.
p.solveCurveX = function(x) {
    var abs = Math.abs;
    var ZERO_LIMIT = 1e-6;
    var t2 = x,
        derivative,
        x2;

    // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
    // First try a few iterations of Newton's method -- normally very fast.
    // http://en.wikipedia.org/wiki/Newton's_method
    for (var i = 0; i < 8; i++) {
        // f(t)-x=0
        x2 = this.sampleCurveX(t2) - x;
        if (abs(x2) < ZERO_LIMIT) {
            return t2;
        }
        derivative = this.sampleCurveDerivativeX(t2);
        // == 0, failure
        if (abs(derivative) < ZERO_LIMIT) {
            break;
        }
        t2 -= x2 / derivative;
    }

    // Fall back to the bisection method for reliability.
    // bisection
    // http://en.wikipedia.org/wiki/Bisection_method
    var t1 = 1,
        t0 = 0;
    t2 = x;
    while (t1 > t0) {
        x2 = this.sampleCurveX(t2) - x;
        if (abs(x2) < ZERO_LIMIT) {
            return t2;
        }
        if (x2 > 0) {
            t1 = t2;
        } else {
            t0 = t2;
        }
        t2 = (t1 + t0) / 2;
    }

    // Failure
    return t2;
}

p.solve = function(x) {
    return this.sampleCurveY(this.solveCurveX(x));
}
CubicBezier.linear=new CubicBezier(0,0,1,1);
CubicBezier.ease=new CubicBezier(.25,.1,.25,1);
CubicBezier.easeIn=new CubicBezier(.42,0,1,1);
CubicBezier.easeOut=new CubicBezier(0,0,.58,1);
CubicBezier.easeInOut=new CubicBezier(.42,0,.58,1);
module.exports = CubicBezier;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var raf=__webpack_require__(0)
function Frame(cb){
  this.execute=function(param,timingFunction){
    ///console.log("args",args);
    raf(function(){

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
  this.then=function(cb){
    typeof cb ==='function' && (afterHandler=cb);
  }
}

module.exports=Frame;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var bezier=__webpack_require__(1)
var raf=__webpack_require__(0)
var Frame=__webpack_require__(2);
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
function bezierAnimation(duration,bezierTimingFunction,handlers,delay,playNum){
  if(!this instanceof bezierAnimation){
    return new bezierAnimation(duration,bezierTimingFunction,handlers,delay);
  }
  var timingFunction=createBezier(bezierTimingFunction);
  var frameHandler,infinite=false;
  if (typeof handlers === 'function') {
    frameHandler=new Frame([handlers]);
  } else if (Object.prototype.toString.call(handlers) === '[object Array]'){
        frameHandler=new Frame(handlers);
  }
  if(!delay)delay=0;
  if(/^[1-9]\d+$/.test(playNum)){
    playNum=parseInt(playNum);
    infinite=false;
  }else if(!playNum){
    playNum=1;
    infinite=false;
  }else if(playNum==='infinite'){
    playCount=1;
  }

  var isRunning=false,isDone=true,delayTimer=null,playCount=playNum;
  var param={
    startTime:0,
    passedTime:0,
    duration:duration,
    progress:0
  }
  this.play=function(){
    if(!param.startTime)param.startTime=Date.now();
    if(isRunning)return this;
    console.log("重新开始");
    if(isDone)isDone=false;
    isRunning=true;

    function playCurrFrame(){
      /*
      progress=(passedTime+Date.now()-startTime)/(duration*1000);
      if(progress>=1){
        progress=1;
      }
      */
      frameHandler.execute(param,timingFunction).then(function(){
        playNext();
      })
      /*
      frameHandler.execute(progress.toFixed(6),timingFunction.solve(progress).toFixed(6)).then(function(){
        playNext();
      })
      */
    }
    function done(){
      isRunning=false;
      isDone=true;
      param.passedTime=0;
      param.startTime=0;
      param.progress=0;
      playCount=playNum;
      delayTimer=null;
      for(var i=0,count=endCb.length;i<count;i++){
        endCb[i]();
      }

    }
    var self=this;
    function reset(){
      param.startTime=0;
      param.progress=0;
    }
    function playNext(){
      if(!isRunning)return;
      if(param.progress>=1){
        if(playNum !== 'infinite'){
          playCount--;
          if(playCount>0){
            reset();
            self.play();
          }else{
            done();
          }
        }else{
          reset();
          self.play();
        }

      }else {
        playCurrFrame();
      }
    }
    if(!delay){
      playCurrFrame();
    }else{
      if(!delayTimer){
        delayTimer=setTimeout(function(){param.startTime=Date.now();playCurrFrame();},delay*1000);
      }else{
        playCurrFrame();
      }
    }
    return this;
  }
  this.stop=function(){
  param.passedTime=Date.now()-param.startTime;
  param.startTime=0;
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
    return this
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


/***/ })
/******/ ]);
});