'use strict';
var BlackScholes = require('app/BlackScholes');
var should = require('should');
var sort_numeric = require('app/sort_numeric');

describe('BlackScholes tests', function() {
  
  it('testExpiryCall', function() {
    var bs1=new BlackScholes('C',80,0,0.25,0);
    (bs1.value(120,0)).should.eql(40);
    (bs1.value(100,0)).should.eql(20);
    (bs1.value(80,0)).should.eql(0);
    (bs1.value(60,0)).should.eql(0);
  });
  
  it('testExpiryPut', function() {
    var bs1=new BlackScholes('P',80,0,0.25,0);
    (bs1.value(120,0)).should.eql(0);
    (bs1.value(100,0)).should.eql(0);
    (bs1.value(80,0)).should.eql(0);
    (bs1.value(60,0)).should.eql(20);
    (bs1.value(40,0)).should.eql(40);
  });
  
  it('testVector', function() {
    var bs1=new BlackScholes('C',80,0,0.25,0.4);
    var x1=bs1.value([40,60,80,100,120],0);
    (Object.keys(x1).length).should.eql(5);
    var x2=bs1.value(90,[0,0.1,0.2,0.3,0.4]);
    (Object.keys(x2).length).should.eql(5);
  });
  
  it('testTensor', function() {
    var bs1=new BlackScholes('C',80,0,0.25,0.4);
    var x3=bs1.value([40,60,80,100,120],[0,0.1,0.2,0.3,0.4]);
    (Object.keys(x3).length==5).should.eql(true);
    for(var k in x3) {
      (Object.keys(x3[k]).length).should.eql(5);
    }
  });
  
  it('testConvexPriceCall', function() {
    var bs1=new BlackScholes('C',80,0,0.25,0.1);
    var S=[40,60,80,100,120];
    var x1=bs1.value(S,0);
    S=sort_numeric(S); //make sure S is sorted
    for(var i=0;i<S.length-1;i++) x1[S[i]].should.below(x1[S[i+1]]);
    // check that this slope is less than 1
    ((x1["120"]-x1["80"])/(120-80)<1).should.eql(true);
  });
  
  it('testConvexPricePut', function() {
    var bs1=new BlackScholes('P',80,0,0.25,0.1);
    var S=[40,60,80,100,120];
    var x1=bs1.value(S,0);
    S=sort_numeric(S); //make sure S is sorted
    for(var i=0;i<S.length-1;i++) x1[S[i]].should.above(x1[S[i+1]]);
    // check that this slope is less than 1
    ((x1["80"]-x1["40"])/(80-40)<1).should.eql(true);
  });
  
  it('testSlopePriceCall', function() {
    // check that this slope is less than 1
    var bs1=new BlackScholes('C',80,0,0.25,0.1);
    var x1=bs1.value([80,120],0);
    ((x1["120"]-x1["80"])/(120-80)<1).should.eql(true);
  });
  
  it('testSlopePricePut', function() {
    // check that this slope is less than 1
    var bs1=new BlackScholes('P',80,0,0.25,0.1);
    var x1=bs1.value([40,80],0);
    ((x1["80"]-x1["40"])/(80-40)<1).should.eql(true);
  });
  
  it('testConvexPriceAndMaturityCall', function() {
    var bs1=new BlackScholes('C',80,0,0.25,0.4);
    var S=[40,60,80,100,120];
    var t=[0.1,0.2,0.3];
    var x1=bs1.value(S,t);
    S=sort_numeric(S); //make sure S is sorted
    t=t.sort(); //make sure t is sorted
    for(var i=0;i<S.length-1;i++) 
      for(var j=0;j<t.length-1;j++)
        x1[S[i]][t[j  ]].should.above(x1[S[i]][t[j+1]]);
    for(var i=0;i<t.length-1;i++) 
      for(var j=0;j<S.length-1;j++) 
        x1[S[j  ]][t[i]].should.below(x1[S[j+1]][t[i]]);
  
  });
  
  it('testCallPremium', function() {
    var bs1=new BlackScholes('C',80,0,0.25,0,2.12);
    (bs1.value(120,0)).should.eql(40-2.12);
    (bs1.value(100,0)).should.eql(20-2.12);
    (bs1.value(80,0)).should.eql(0-2.12);
    (bs1.value(60,0)).should.eql(0-2.12);
  });
  
});
