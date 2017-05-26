var expect = require('chai').expect;
var raf=require('../src/raf');

describe('帧引擎测试',function(){
    it('添加帧处理函数，每秒帧率在60左右',function(done){
      var start=Date.now();
      var count=0;
      raf(function loop(){
        if((Date.now()-start)>=1000){
          console.log("帧率",count);
          expect(count>45&&count<65).to.be.true;
            done();
          return;
        }
        count++;
        raf(loop);
      })
    });
    it('移除帧处理函数，下一个渲染周期不再执行被移除的处理函数',function(done){
      var count=0;
      function handler(){
        count=1;
      }
      var id=raf(handler);
      raf.cancel(id);
      raf(function(){
        expect(count).to.be.equal(0);
        done();
      })


    });
});
