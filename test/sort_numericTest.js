'use strict';
var sort_numeric = require('app/sort_numeric');
var should = require('should');

describe('sort_numeric tests', function() {

  it('sort_numeric([3,1,2])', function() { sort_numeric([3,1,2]).should.eql([1,2,3]); });
  it('sort_numeric([1,2,3])', function() { sort_numeric([1,2,3]).should.eql([1,2,3]); });
  it('sort_numeric([])', function() { sort_numeric([]).should.eql([]); });
  it('sort_numeric(123)', function() {
    try {
      sort_numeric(123);
      should.fail("Shouldnt get here");
    } catch(ex) {
      (ex.message=="Object 123 has no method 'sort'" || ex.message=="undefined is not a function").should.eql(true); // 2nd message shows up in travis-ci
    }
  });

}); 
