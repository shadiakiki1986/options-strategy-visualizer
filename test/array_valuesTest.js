'use strict';
var array_values = require('app/array_values');
var should = require('should');

describe('array_values tests', function() {

  it('array_values([1,2,3])', function() { array_values([1,2,3]).should.eql([1,2,3]); });
  it('array_values([])', function() { array_values([]).should.eql([]); });
  it('array_values({a:1,b:2,c:3})', function() { array_values({a:1,b:2,c:3}).should.eql([1,2,3]); });
  it('array_values(123)', function() {
    try {
      array_values(123).should.eql(123);
      should.fail("Shouldnt get here");
    } catch(ex) {
      ex.message.should.eql("Object.keys called on non-object");
    }
  });

}); 
