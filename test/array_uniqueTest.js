'use strict';
var array_unique = require('app/array_unique');

describe('array_unique tests', function() {

  it('[1,2,2,1] => [1,2]', function() {
    array_unique([1,2,1]).should.eql([1,2]);
  });

  it('[1,2] => [1,2]', function() {
    array_unique([1,2]).should.eql([1,2]);
  });

  it('[] => []', function() {
    array_unique([]).should.eql([]);
  });

  it('[{a:..,n:..},{a:..,n:..}] => [...]', function() {
    array_unique([ { a: 'B', n: 123 }, { a: 'B', n: 123 } ]).should.eql([ { a: 'B', n: 123 } ]);
  });

}); 
