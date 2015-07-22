(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// CND and value functions from: http://cseweb.ucsd.edu/~goguen/courses/130/SayBlackScholes.html
var is_array = require('app/is_array');

var BlackScholes = function(call_put_flag, X, r, v, T, V) {
// call_put_flag: 'c' or anything else for put
// This T is the maturity date (compare to t in value function)
// X: strike
// r: interest rates
// v: volatility
// V: market value

  if(["C","P","S"].indexOf(call_put_flag)==-1) throw("Unsupported call_put_flag=call_put_flag");
  this.call_put_flag=call_put_flag;
  this.X=X;
  this.r=r;
  this.v=v;
  this.T=T;
  this.V=typeof V==='undefined'?0:V;
};

BlackScholes.prototype.CND = function(x) {
  var Pi = 3.141592653589793238;
  var a1 = 0.319381530;
  var a2 = -0.356563782;
  var a3 = 1.781477937;
  var a4 = -1.821255978;
  var a5 = 1.330274429;
  var L = Math.abs(x);
  var k = 1 / ( 1 + 0.2316419 * L);
  var p = 1 - 1 /  Math.pow(2 * Pi, 0.5) * Math.exp( -Math.pow(L, 2) / 2 ) * (a1 * k + a2 * Math.pow(k, 2)
       + a3 * Math.pow(k, 3) + a4 * Math.pow(k, 4) + a5 * Math.pow(k, 5) );
  if (x >= 0) { 
    return p;
  } else {
    return 1-p;
  }
}

BlackScholes.prototype.value = function(S, t) {
// t: physical time
  var o={};
  if(this.call_put_flag=="S") {
    for(var Si in S) o[S[Si]]=S[Si];
    return o;
  }
  if(is_array(S)) {
    for(var Si in S) o[S[Si]]=this.value(S[Si],t);
    return o;
  }
  if(is_array(t)) {
    for(var ti in t) o[t[ti]]=this.value(S,t[ti]);
    return o;
  }

  var Tmt=this.T-t;
  if(Tmt==0) return this.value0(S);
  if(Tmt<0) return 0; // expired

  var d1 = ( Math.log(S / this.X) + (this.r + Math.pow(this.v, 2) / 2) * Tmt ) / ( this.v * Math.pow(Tmt, 0.5) );
  var d2 = d1 - this.v * Math.pow(Tmt, 0.5);
  if (this.call_put_flag == 'C') {
    return S * this.CND(d1) - this.X * Math.exp( -this.r * Tmt ) * this.CND(d2) - this.V;
  } else { 
    return this.X * Math.exp( -this.r * Tmt ) * this.CND(-d2) - S * this.CND(-d1) - this.V;
  }
}

BlackScholes.prototype.value0 = function(S) {
  if (this.call_put_flag == 'C') {
    return Math.max(S - this.X, 0) - this.V;
  } else { 
    return Math.max(this.X - S, 0) - this.V;
  }
}

BlackScholes.prototype.id = function() {
  return ""+this.call_put_flag+"_"+this.X+"_"+this.r+"_"+this.v+"_"+this.T; // not appending V here because V is the market value, and it should be the same for both options if they are similar
}

module.exports = function(call_put_flag, X, r, v, T, V) {
  return new BlackScholes(call_put_flag, X, r, v, T, V);
};

},{"app/is_array":8}],2:[function(require,module,exports){
var BlackScholes = require('app/BlackScholes');
var is_numeric = require('app/is_numeric');
var is_array = require('app/is_array');
var is_int = require('app/is_int');
var array_sum = require('app/array_sum');
var array_unique = require('app/array_unique');
var array_values = require('app/array_values');
var array_max = require('app/array_max');

var OptionsStrategy = function(portfolio) {
// array of BlackScholes objects
  if(!is_array(portfolio)) throw("Portfolio should be an array");
  if(portfolio.length==0) throw("Portfolio is empty");
  portfolio.forEach(function(p) {
    if(!p.hasOwnProperty("o")) throw("Portfolio missing o key");
    if(!p.hasOwnProperty("q")) throw("Portfolio missing q key");
    if(!is_int(p["q"])) throw("quantity should be numeric integer");
    if(! p["o"] instanceof BlackScholes ) throw("Portfolio should be array of BlackScholes objects");
  });

  // test no duplicates
  ids=portfolio.map(function(p) { return p["o"].id(); });
  if(ids.length!=array_unique(ids).length) throw("Duplicate options in portfolio detected");

  // portfolio being keyed by portfolio ID and stored in class member
  this.portfolio={};
  for(var i=0;i<Object.keys(portfolio).length;i++) {
    var p = portfolio[i];
    this.portfolio[p["o"].id()]=p;
  }
}

OptionsStrategy.prototype.loss = function(S,t,mult) {
// S: underlying value
// t: physical time
// mult: factor with which to multiply the loss... useful for this.margin

  mult = typeof mult === 'undefined'?1:mult;
  if(!is_numeric(mult)) throw("mult should be numeric");
  return this.loss2(this.loss1(S,t),mult,S,t);
}

OptionsStrategy.prototype.loss1 = function(S,t) {
// sub-function of loss
  vals={};
  for(var id in this.portfolio) {
    var p = this.portfolio[id];
    var v=p["o"].value(S,t);
    if(!is_numeric(v)) {
      // 1st dimension: S
      for(var ki in v) {
        if(!is_numeric(v[ki])) {
          // 2nd dimension: t
          for(var kii in v[ki]) {
            v[ki][kii] =  v[ki][kii]*p.q;
          }
        } else {
          v[ki] = v[ki]*p.q;
        }
      } 
    } else {
      v=v*p.q;
    }

    // swap dimensions of options with (S,t)
    if(!is_numeric(v)) {
      for(var ki in v) {
        if(!vals.hasOwnProperty(ki)) vals[ki]={};
        if(!is_numeric(v[ki])) {
          for(var kii in v[ki]) {
            if(!vals[ki].hasOwnProperty(kii)) vals[ki][kii]={};
            vals[ki][kii][id]=v[ki][kii];
          }
        } else {
          vals[ki][id]=v[ki];
        }
      }
    } else {
      vals[id]=v;
    }
  }
  return vals;
}

OptionsStrategy.prototype.loss2 = function(vals,mult,S,t) {
// sub-function of loss
  if(is_numeric(S)&&is_numeric(t)) {
    vals = array_sum(array_values(vals));
    vals = Math.min(vals,0)*mult;
  } else {
    if(!is_numeric(S)&&!is_numeric(t)) {
      for(var ki in vals) {
        var vi = vals[ki];
        for(var kii in vi) {
          var vii = vi[kii];
          vii = array_sum(array_values(vii));
          vii = Math.min(vii,0)*mult;
          vals[ki][kii] = vii;
        }
      }
    } else {
      if(is_numeric(S)||is_numeric(t)) {
        for(var ki in vals) {
          var vi = vals[ki];
          vi = array_sum(array_values(vi));
          vi = Math.min(vi,0)*mult;
          vals[ki] = vi;
        }
      } else {
        throw("WTF");
      }
    }
  }
  return vals;
}

OptionsStrategy.prototype.margin = function(S,t) {
  m=this.loss(S,t,-1);
  if(is_numeric(S)&&is_numeric(t)) {
    if(this.portfolio.length==1) return m; // this would be numeric in this case
    return m;
  } else {
    if(!is_numeric(S)&&!is_numeric(t)) {
      var m2 = array_values(m).map(function(x) { return array_values(x); });
      var m3 = m2.map(array_max);
      var m4 = array_max(m3);
      return m4;
    } else {
      if(is_numeric(S)||is_numeric(t)) {
        return array_max(array_values(m));
      } else {
        throw("WTF");
      }
    }
  }
}

module.exports = function(portfolio) {
  return new OptionsStrategy(portfolio);
};

},{"app/BlackScholes":1,"app/array_max":3,"app/array_sum":4,"app/array_unique":5,"app/array_values":6,"app/is_array":8,"app/is_int":9,"app/is_numeric":10}],3:[function(require,module,exports){
var is_array = require('app/is_array');

module.exports = function(vals) {
  if(!is_array(vals)) throw("Not an array");
  if(vals.length==0) throw("Empty array");
  return vals.reduce(function(a,b) { if(a<b) return b; else return a; },vals[0]);
};

},{"app/is_array":8}],4:[function(require,module,exports){
var is_numeric = require('app/is_numeric');
var is_array = require('app/is_array');

module.exports = function(vals) {
  if(!is_array(vals)) throw("Not an array");
  vals.forEach(function(x) { if(!is_numeric(x)) throw("Non-numeric found"); });
  var o = vals.reduce(function(a,b) { return a+b; },0);
  return o;
};

},{"app/is_array":8,"app/is_numeric":10}],5:[function(require,module,exports){
module.exports = function (obj) {
  var o=[];
  var o2=[];
  obj.forEach(function(x) {
    var x2=JSON.stringify(x);
    if(o2.indexOf(x2)==-1) {
      o.push(x);
      o2.push(x2);
    }
  });
  return o;
}


},{}],6:[function(require,module,exports){
var is_array = require('app/is_array');

module.exports = function(vals) {
  if(!is_array(vals)&&!is_array(Object.keys(vals))) throw("Not an array");
  return Object.keys(vals).map(function(x) { return vals[x]; });
};

},{"app/is_array":8}],7:[function(require,module,exports){
'use strict';
var OptionsStrategy = require('app/OptionsStrategy');
var BlackScholes = require('app/BlackScholes');

function OptStratVis(portfolio,S,Tmt) {
// portfolio: [{q: 1, t:'P', X:80, r:0, v:0.25, T:0, V:2.12}]
// S: 60 or [60,80,100,120]
// Tmt: 0 or [0,0.1,0.2]
  var p2 = portfolio.map(function(x) {
    return {
      q: x.q,
      o: new BlackScholes(
        x.t, x.X, x.r, x.v, x.T,
        x.hasOwnProperty("V")?x.V:undefined
      )
    };
  });
  var bs1=new OptionsStrategy(p2);
  var x=bs1.margin(S,Tmt);
  return x;
};

},{"app/BlackScholes":1,"app/OptionsStrategy":2}],8:[function(require,module,exports){
// http://stackoverflow.com/a/4775737
module.exports = function(obj) {
  return( Object.prototype.toString.call( obj ) === '[object Array]' );
};
;

},{}],9:[function(require,module,exports){
var is_numeric = require('app/is_numeric');

// http://stackoverflow.com/a/1830844
module.exports = function(obj) {
    return is_numeric(obj) && Math.floor(obj)==obj;
};

},{"app/is_numeric":10}],10:[function(require,module,exports){
// http://stackoverflow.com/a/1830844
var is_array = require('app/is_array');

module.exports = function(obj) {
    return !is_array( obj ) && obj===parseFloat(obj) && (obj - parseFloat( obj ) + 1) >= 0;
};

},{"app/is_array":8}]},{},[7]);
