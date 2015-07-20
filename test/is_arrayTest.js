'use strict';
var is_array = require('app/is_array');
var should = require('should');

describe('is_array tests', function() {

  it('is_array([1,2,3])', function() {
    is_array([1,2,3]).should.eql(true);
  });

  it('is_array([])', function() {
    is_array([]).should.eql(true);
  });

  it('is_array(123)', function() {
    is_array(123).should.eql(false);
  });

}); 
