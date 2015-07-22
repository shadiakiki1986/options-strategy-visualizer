'use strict';
var OptStratVis = require('app/index');
var should = require('should');

describe('index tests', function() {
  
  it('covered call short', function(done) {
    var x=OptStratVis.margin({
      portfolio: [
        { q:  1, t:'C', X:80, r:0, v:0.25, T:0}, // [{q: 1, t:'P', X:80, r:0, v:0.25, T:0, V:2.12}]
        { q: -1, t:'S', X:80, r:0, v:0.25, T:0}
      ],
      S: [60,80,100,120],
      Tmt: 0},
      { succeed: function(x) { x.should.eql(80); done(); },
        fail: function(x) { should.fail(x); }
      }
    );
  });

  it('undefined portfolio', function(done) {
      var x=OptStratVis.margin({
        S: [60,80,100,120],
        Tmt: 0},
        { succeed: function(x) { should.fail("Shouldnt get here 1"); },
          fail: function(x) { x.should.eql("Cannot call method 'map' of undefined"); done(); }
        }
      );
  });

});
