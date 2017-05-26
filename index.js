var prefixVendors=['moz','webkit'];
var eventName='AnimationFrame';
var raf='request'+eventName,caf='cancel'+eventName||'cancelRequest'+eventName;

if(!raf){
  for(var i=0;i<prefixVendors.length;i++){
    raf=prefixVendors[i]+'Request'+eventName;
    caf=prefixVendors[i]+'Cancel'+eventName || prefixVendors+'CancelRequest'+eventName;
  }
}
