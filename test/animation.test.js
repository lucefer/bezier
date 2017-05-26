var expect = require('chai').expect;
var Animation=require('../src/animation');

describe('动画引擎测试',function(){
    it('添加贝塞尔动画函数',function(done){
      var animation=new Animation(0.5,'linear',function(i1,i2){
      })
      animation.play()
      expect(animation.isRunning()).to.be.true
      expect(animation.isDone()).to.be.false
      expect(animation.isStopped()).to.be.false
      animation.stop()
      expect(animation.isRunning()).to.be.false
      expect(animation.isDone()).to.be.false
      expect(animation.isStopped()).to.be.true
      animation.play()
      animation.end(function(){
        expect(animation.isDone()).to.be.true
        expect(animation.isStopped()).to.be.false
        expect(animation.isRunning()).to.be.false
        done()
      })
    });

});
