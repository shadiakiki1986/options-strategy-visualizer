'use strict';
require('app/is_array');

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
