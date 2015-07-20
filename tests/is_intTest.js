'use strict';
require('app/is_int');

describe('is_int tests', function() {

  it('is_int(123)', function() { is_int(123).should.eql(true); });
  it('is_int(123.35)', function() { is_int(123).should.eql(false); });

}); 
