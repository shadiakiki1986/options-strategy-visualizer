'use strict';
var array_max = require('app/array_max');
var should = require('should');

describe('array_max tests', function() {

  it('array_max([1,2,3])', function() { array_max([1,2,3]).should.eql(3); });
  it('array_max([])', function() {
    try {
      array_max([]).should.eql(123);
      should.fail("Shouldnt get here");
    } catch(ex) {
      ex.should.eql("Empty array");
    }
  });

  it('array_max(123)', function() {
    try {
      array_max(123).should.eql(123);
      should.fail("Shouldnt get here");
    } catch(ex) {
      ex.should.eql("Not an array");
    }
  });

}); 
