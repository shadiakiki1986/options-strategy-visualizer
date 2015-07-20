'use strict';
require('app/is_numeric');

describe('is_numeric tests', function() {

  it('is_numeric([1,2,3])', function() { is_numeric([1,2,3]).should.eql(false); });
  it('is_numeric([])', function() { is_numeric([]).should.eql(false); });
  it('is_numeric(123)', function() { is_numeric(123).should.eql(true); });
  it('is_numeric("avb")', function() { is_numeric("avb").should.eql(false); });
  it('is_numeric(null)', function() { is_numeric(null).should.eql(false); });
  it('is_numeric(undefined)', function() { is_numeric(undefined).should.eql(false); });

}); 
