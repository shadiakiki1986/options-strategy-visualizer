<?php
# CND and value functions from: http://cseweb.ucsd.edu/~goguen/courses/130/SayBlackScholes.html

class BlackScholes {

var $call_put_flag, $X, $r, $v, $T;

function __construct($call_put_flag, $X, $r, $v, $T) {
// call_put_flag: 'c' or anything else for put
// This T is the maturity date (compare to t in value function)

	if(!in_array($call_put_flag,array("C","P","S"))) throw new Exception("Unsupported call_put_flag=$call_put_flag");
	$this->call_put_flag=$call_put_flag;
	$this->X=$X;
	$this->r=$r;
	$this->v=$v;
	$this->T=$T;

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

	function value ($S, $t) {
	// t: physical time
		if($this->call_put_flag=="S") {
			$o=array();
			foreach($S as $Si) $o[(string)$Si]=$Si;
			return $o;
		}
		if(is_array($S)) {
			$o=array();
			foreach($S as $Si) $o[(string)$Si]=$this->value($Si,$t);
			return $o;
		}
		if(is_array($t)) {
			$o=array();
			foreach($t as $ti) $o[(string)$ti]=$this->value($S,$ti);
			return $o;
		}

		$Tmt=$this->T-$t;
		if($Tmt==0) return $this->value0($S);
		if($Tmt<0) return 0; // expired

		$d1 = ( log($S / $this->X) + ($this->r + pow($this->v, 2) / 2) * $Tmt ) / ( $this->v * pow($Tmt, 0.5) );
		$d2 = $d1 - $this->v * pow($Tmt, 0.5);
		if ($this->call_put_flag == 'C') {
			return $S * $this->CND($d1) - $this->X * exp( -$this->r * $Tmt ) * $this->CND($d2);
		} else { 
			return $this->X * exp( -$this->r * $Tmt ) * $this->CND(-$d2) - $S * $this->CND(-$d1);
		}
	}

	function value0($S) {
		if ($this->call_put_flag == 'C') {
			return max($S - $this->X, 0);
		} else { 
			return max($this->X - $S, 0);
		}
	}

function id() {
	return "".$this->call_put_flag."_".$this->X."_".$this->r."_".$this->v."_".$this->T;
}

} // end class
