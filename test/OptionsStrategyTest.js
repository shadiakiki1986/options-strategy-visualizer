'use strict';
var OptionsStrategy = require('app/OptionsStrategy');
var should = require('should');

describe('OptionsStrategy tests', function() {
  
  it('testLongCall', function() {
    var bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('C',80,0,0.25,0)}]);
    (bs1.loss(120,0)==0).should.eql(true);
    (bs1.loss(100,0)==0).should.eql(true);
    (bs1.loss(80,0)==0).should.eql(true);
    (bs1.loss(60,0)==0).should.eql(true);
  });
  
  it('testShortCall', function() {
    var bs1=new OptionsStrategy([{q:-1, o: new BlackScholes('C',80,0,0.25,0)}]);
    (bs1.loss(120,0)==-40).should.eql(true);
    (bs1.loss(100,0)==-20).should.eql(true);
    (bs1.loss(80,0)==0).should.eql(true);
    (bs1.loss(60,0)==0).should.eql(true);
  });
  
  it('testDupes', function() {
    try {
      var bs1=new OptionsStrategy([
        {q: 2, o: new BlackScholes('C',80,0,0.25,0)},
        {q: 2, o: new BlackScholes('C',80,0,0.25,0)}
      ]);
      (false).should.eql(true); // should not get here
    } catch(ex) {
      (ex.message=="Duplicate options in portfolio detected").should.eql(true);
    }
  });
  
  it('testLong2xCall', function() {
    bs2=new OptionsStrategy([{q:2, o: new BlackScholes('C',80,0,0.25,0)}]);
    (bs2.loss(120,0)==0).should.eql(true);
    (bs2.loss(100,0)==0).should.eql(true);
    (bs2.loss(80,0)==0).should.eql(true);
    (bs2.loss(60,0)==0).should.eql(true);
  });
  
  it('testShort2xCall', function() {
    var bs1=new OptionsStrategy([{q: -2, o: new BlackScholes('C',80,0,0.25,0))}]);
    (bs1.loss(120,0)==-80).should.eql(true);
    (bs1.loss(100,0)==-40).should.eql(true);
    (bs1.loss(80,0)==0).should.eql(true);
    (bs1.loss(60,0)==0).should.eql(true);
  });
  
  it('testQtyZero', function() {
    bs2=new OptionsStrategy([{q: 0, o: new BlackScholes('C',80,0,0.25,0))}]);
    (bs2.loss(120,0)==0).should.eql(true);
    (bs2.loss(100,0)==0).should.eql(true);
    (bs2.loss(80,0)==0).should.eql(true);
    (bs2.loss(60,0)==0).should.eql(true);
  });
  
  it('testLongPut', function() {
    var bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('P',80,0,0.25,0))}]);
    (bs1.loss(120,0)==0).should.eql(true);
    (bs1.loss(100,0)==0).should.eql(true);
    (bs1.loss(80,0)==0).should.eql(true);
    (bs1.loss(60,0)==0).should.eql(true);
  });
  
  it('testShortPut', function() {
    var bs1=new OptionsStrategy([{q: -1, o: new BlackScholes('P',80,0,0.25,0))}]);
    (bs1.loss(120,0)==0).should.eql(true);
    (bs1.loss(100,0)==0).should.eql(true);
    (bs1.loss(80,0)==0).should.eql(true);
    (bs1.loss(60,0)==-20).should.eql(true);
  });
  
  it('testMarginNumeric', function() {
    // test that margin is always numeric
  
    var bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('P',80,0,0.25,0))}]);
    var x=bs1.margin(60,0);
    (is_numeric(x)).should.eql(true);
  
    bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('P',80,0,0.25,0))}]);
    x=bs1.margin([60,80,100,120],0);
    (is_numeric(x)).should.eql(true);
  
    bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('P',80,0,0.25,0.2))}]);
    x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (is_numeric(x)).should.eql(true);
  
    bs1=new OptionsStrategy([
      {q:1,  o: new BlackScholes('P',80,0,0.25,0)},
      {q:-1, o: new BlackScholes('P',90,0,0.25,0)}
    ]);
    x=bs1.margin(60,0);
    (is_numeric(x)).should.eql(true);
  });
  
  it('testVector', function() {
    var bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('P',80,0,0.25,0))}]);
    var x=bs1.loss([60,80,100,120],0);
    (Object.keys(x).length==4).should.eql(true);
  });
  
  it('testShortCallVector', function() {
    var bs1=new OptionsStrategy([{q: -1, o: new BlackScholes('C',80,0,0.25,0))}]);
    var x=bs1.margin([60,80,100,120],0);
    (x==40).should.eql(true);
  });
  
  it('testTensor', function() {
    var bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('P',80,0,0.25,0.2))}]);
    x3=bs1.loss([60,80,100,120],[0,0.1,0.2]);
    (Object.keys(x3).length==4).should.eql(true);
    for(var k in x3) {
      (Object.keys(x3[k]).length==3).should.eql(true);
    }
  });
  
  it('testShortCallTensor', function() {
    var bs1=new OptionsStrategy([{q: -1, o: new BlackScholes('C',80,0,0.25,0.2))}]);
    var x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (x>40 && x<41).should.eql(true);
  });
  
  it('testStraddleLong', function() {
    var bs1=new OptionsStrategy([
      { q: 1, o: new BlackScholes('C',80,0,0.25,0.2)},
      { q: 1, o: new BlackScholes('P',80,0,0.25,0.2)}
    ]);
    var x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (x==0).should.eql(true);
  });
  
  it('testStraddleShort', function() {
    var bs1=new OptionsStrategy([
      { q: -1, o: new BlackScholes('C',80,0,0.25,0.2)},
      { q: -1, o: new BlackScholes('P',80,0,0.25,0.2)}
    ]);
    var x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (x>40&&x<41).should.eql(true);
  });
  
  it('testSpreadLong', function() {
    var bs1=new OptionsStrategy([
      { q:  1, o: new BlackScholes('C',80,0,0.25,0.2)},
      { q: -1, o: new BlackScholes('C',90,0,0.25,0.2)}
    ]);
    var x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (x==0).should.eql(true);
  });
  
  it('testSpreadShort', function() {
    var bs1=new OptionsStrategy([
      { q: -1, o: new BlackScholes('C',80,0,0.25,0.2)},
      { q:  1, o: new BlackScholes('C',90,0,0.25,0.2)}
    ]);
    var x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (x==10).should.eql(true);
  });
  
  it('testCondorLong', function() {
    var bs1=new OptionsStrategy([
      { q: -1, o: new BlackScholes('C',70,0,0.25,0.2)},
      { q:  1, o: new BlackScholes('C',80,0,0.25,0.2)},
      { q:  1, o: new BlackScholes('C',90,0,0.25,0.2)},
      { q: -1, o: new BlackScholes('C',100,0,0.25,0.2)}
    ]);
    var x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (x==10).should.eql(true);
  });
  
  it('testCondorShort', function() {
    var bs1=new OptionsStrategy([
      { q:  1, o: new BlackScholes('C',70,0,0.25,0.2)},
      { q: -1, o: new BlackScholes('C',80,0,0.25,0.2)},
      { q: -1, o: new BlackScholes('C',90,0,0.25,0.2)},
      { q:  1, o: new BlackScholes('C',100,0,0.25,0.2)}
    ]);
    var x=bs1.margin([60,80,100,120],[0,0.1,0.2]);
    (x==0).should.eql(true);
  });
  
  it('testNotBlackScholes', function() {
    try {
      var bs1=new OptionsStrategy([{ q: 2, o: [1,2,3,4,5]}]);
    } catch(ex) {
      (ex.message=="Portfolio should be array of BlackScholes objects").should.eql(true);
    }
  });
  
  it('testQtyNotNumeric', function() {
    try {
      var bs1=new OptionsStrategy([
        { q: -1, o: new BlackScholes('C',80,0,0.25,0)},
        { q:  "1", o: new BlackScholes('C',90,0,0.25,0)}
      ]);
      (false).should.eql(true); // should not get here
    } catch(ex) {
      (ex.message=="quantity should be numeric integer").should.eql(true);
    }
  });
  
  it('testSecurityLong', function() {
    var bs1=new OptionsStrategy([{q:  1, o: new BlackScholes('S',80,0,0.25,0))}]);
    var x=bs1.margin([60,80,100,120],0);
    (x==0).should.eql(true);
  });
  
  it('testSecurityShort', function() {
    var bs1=new OptionsStrategy([{q: -1, o: new BlackScholes('S',80,0,0.25,0))}]);
    var x=bs1.margin([60,80,100,120],0);
    (x==120).should.eql(true);
  });
  
  it('testCoveredCallLong', function() {
    var bs1=new OptionsStrategy([
      { q: -1, o: new BlackScholes('C',80,0,0.25,0)},
      { q:  1, o: new BlackScholes('S',80,0,0.25,0)}
    ]);
    var x=bs1.margin([60,80,100,120],0);
    (x==0).should.eql(true);
  });
  
  it('testCoveredCallShort', function() {
    var bs1=new OptionsStrategy([
      { q:  1, o: new BlackScholes('C',80,0,0.25,0)},
      { q: -1, o: new BlackScholes('S',80,0,0.25,0)}
    ]);
    var x=bs1.margin([60,80,100,120],0);
    (x==80).should.eql(true);
  });
  
  it('testLongCallPremium', function() {
    var bs1=new OptionsStrategy([{q: 1, o: new BlackScholes('C',80,0,0.25,0,2.12))}]);
    var x=bs1.margin([60,80,100,120],0);
    (x==2.12).should.eql(true);
  });

}
