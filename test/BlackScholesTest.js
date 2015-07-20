'use strict';
var BlackScholes = require('app/BlackScholes');
var should = require('should');

describe('BlackScholes tests', function() {

    it('testExpiryCall', function() {
	var bs1=new BlackScholes('C',80,0,0.25,0);
	(bs1.value(120,0)==40).should.eql(true)
	(bs1.value(100,0)==20).should.eql(true)
	(bs1.value(80,0)==0).should.eql(true)
	(bs1.value(60,0)==0).should.eql(true)
    });

    it('testExpiryPut', function() {
	var bs1=new BlackScholes('P',80,0,0.25,0);
	(bs1.value(120,0)==0).should.eql(true)
	(bs1.value(100,0)==0).should.eql(true)
	(bs1.value(80,0)==0).should.eql(true)
	(bs1.value(60,0)==20).should.eql(true)
	(bs1.value(40,0)==40).should.eql(true)
    });

    it('testVector', function() {
	var bs1=new BlackScholes('C',80,0,0.25,0.4);
	var x1=bs1.value(array(40,60,80,100,120),0);
	this.assertTrue(x1.length==5);
	var x2=bs1.value(90,array(0,0.1,0.2,0.3,0.4));
	this.assertTrue(x2.length==5);
    });

    it('testTensor', function() {
	var bs1=new BlackScholes('C',80,0,0.25,0.4);
	x3=bs1.value(array(40,60,80,100,120),array(0,0.1,0.2,0.3,0.4));
	this.assertTrue(x3.length==5);
	for(x3 as k) {
		this.assertTrue(count(x3[k])==5);
	}
    });

    it('testConvexPriceCall', function() {
	var bs1=new BlackScholes('C',80,0,0.25,0.1);
	var S=array(40,60,80,100,120);
	var x1=bs1.value(S,0);
	S=sort(S); //make sure S is sorted
	for(var i=0;i<S.length-1;i++) this.assertTrue( x1[(string)S[i]] > x1[(string)S[i+1]]);
	// check that this slope is less than 1
	this.assertTrue((x1["120"]-x1["80"])/(120-80)<1);
    });

    it('testConvexPricePut', function() {
	var bs1=new BlackScholes('P',80,0,0.25,0.1);
	var S=array(40,60,80,100,120);
	var x1=bs1.value(S,0);
	S=sort(S); //make sure S is sorted
	for(var i=0;i<S.length-1;i++) this.assertTrue( x1[(string)S[i]] < x1[(string)S[i+1]]);
	// check that this slope is less than 1
	this.assertTrue((x1["80"]-x1["40"])/(80-40)<1);
    });

    it('testSlopePriceCall', function() {
	// check that this slope is less than 1
	var bs1=new BlackScholes('C',80,0,0.25,0.1);
	var x1=bs1.value(array(80,120),0);
	this.assertTrue((x1["120"]-x1["80"])/(120-80)<1);
    });

    it('testSlopePricePut', function() {
	// check that this slope is less than 1
	var bs1=new BlackScholes('P',80,0,0.25,0.1);
	var x1=bs1.value(array(40,80),0);
	this.assertTrue((x1["80"]-x1["40"])/(80-40)<1);
    });

    it('testConvexPriceAndMaturityCall', function() {
	var bs1=new BlackScholes('C',80,0,0.25,0.4);
	var S=array(40,60,80,100,120);
	var t=array(0.1,0.2,0.3);
	var x1=bs1.value(S,t);
	S=sort(S); //make sure S is sorted
	t=sort(t); //make sure t is sorted
	for(var i=0;i<S.length-1;i++) 
		for(var j=0;j<t.length-1;j++) 
			this.assertTrue(
				x1[(string)S[i]][(string)t[j  ]]
				>
				x1[(string)S[i]][(string)t[j+1]]
			);
	for(var i=0;i<t.length-1;i++) 
		for(var j=0;j<S.length-1;j++) 
			this.assertTrue(
				x1[(string)S[j  ]][(string)t[i]]
				>
				x1[(string)S[j+1]][(string)t[i]]
			);

    });

    it('testCallPremium', function() {
	var bs1=new BlackScholes('C',80,0,0.25,0,2.12);
	(bs1.value(120,0)==40-2.12).should.eql(true)
	(bs1.value(100,0)==20-2.12).should.eql(true)
	(bs1.value(80,0)==0-2.12).should.eql(true)
	(bs1.value(60,0)==0-2.12).should.eql(true)
    });

}
