'use strict';
var array_sum = require('app/array_sum');
var should = require('should');

describe('array_sum tests', function() {

  it('array_sum([1,2,3])', function() { array_sum([1,2,3]).should.eql(6); });
  it('array_sum([])', function() { array_sum([]).should.eql(0); });
  it('array_sum(123)', function() {
    try {
      array_sum(123).should.eql(123);
      should.fail("Shouldnt get here");
    } catch(ex) {
      ex.should.eql("Not an array");
    }
  });

}); 
