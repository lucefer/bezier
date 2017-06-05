var expect = require('chai').expect;
var Animation=require('../src/animation');

describe('动画引擎测试',function(){
    it('添加贝塞尔动画函数',function(done){
      var animation=new Animation(0.5,'linear',function(i1,i2){
      })
      animation.play()
      expect(animation.getStatus()==='RUNNING').to.be.true
      animation.stop()
      expect(animation.getStatus()==='PAUSING').to.be.true
      animation.play()
      animation.end(function(){
        expect(animation.getStatus()==='OVER').to.be.true
        done()
      })
    });

});
