'use strict';
var OptStratVis = require('app/index');
var should = require('should');

describe('index tests', function() {
  
  it('covered call short', function() {
    var x=OptStratVis([
        { q:  1, t:'C', X:80, r:0, v:0.25, T:0}, // [{q: 1, t:'P', X:80, r:0, v:0.25, T:0, V:2.12}]
        { q: -1, t:'S', X:80, r:0, v:0.25, T:0}
      ],
      [60,80,100,120],
      0);
    x.should.eql(80);
  });

});
