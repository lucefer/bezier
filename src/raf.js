var prefixVendors=['moz','webkit'];
var mainName='AnimationFrame';
var top=global?global:window;
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
