<?php
# CND and value functions from: http://cseweb.ucsd.edu/~goguen/courses/130/SayBlackScholes.html

class BlackScholes {

var $call_put_flag, $X, $r, $v;

function __construct($call_put_flag, $X, $r, $v) {
// call_put_flag: 'c' or anything else for put

	$this->call_put_flag=$call_put_flag;
	$this->X=$X;
	$this->r=$r;
	$this->v=$v;
}

	function CND ($x) {
		$Pi = 3.141592653589793238;
		$a1 = 0.319381530;
		$a2 = -0.356563782;
		$a3 = 1.781477937;
		$a4 = -1.821255978;
		$a5 = 1.330274429;
		$L = abs($x);
		$k = 1 / ( 1 + 0.2316419 * $L);
		$p = 1 - 1 /  pow(2 * $Pi, 0.5) * exp( -pow($L, 2) / 2 ) * ($a1 * $k + $a2 * pow($k, 2)
		     + $a3 * pow($k, 3) + $a4 * pow($k, 4) + $a5 * pow($k, 5) );
		if ($x >= 0) { 
			return $p;
		} else {
			return 1-$p;
		}
	}

	function value ($S, $T) {
		if(is_array($S)) {
			$o=array();
			foreach($S as $Si) $o[(string)$Si]=$this->value($Si,$T);
			return $o;
		}
		if(is_array($T)) {
			$o=array();
			foreach($T as $Ti) $o[(string)$Ti]=$this->value($S,$Ti);
			return $o;
		}

		if($T==0) return $this->value0($S);

		$d1 = ( log($S / $this->X) + ($this->r + pow($this->v, 2) / 2) * $T ) / ( $this->v * pow($T, 0.5) );
		$d2 = $d1 - $this->v * pow($T, 0.5);
		if ($this->call_put_flag == 'c') {
			return $S * $this->CND($d1) - $this->X * exp( -$this->r * $T ) * $this->CND($d2);
		} else { 
			return $this->X * exp( -$this->r * $T ) * $this->CND(-$d2) - $S * $this->CND(-$d1);
		}
	}

	function value0($S) {
		if ($this->call_put_flag == 'c') {
			return max($S - $this->X, 0);
		} else { 
			return max($this->X - $S, 0);
		}
	}

} // end class
