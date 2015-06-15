<?php

require_once dirname(__FILE__).'/../root.php';
require_once ROOT.'/src/BlackScholes.php';

class OptionsStrategy {

var $portfolio;

function __construct($portfolio) {
// array of BlackScholes objects

	if(!is_array($portfolio)) throw new Exception("Portfolio should be an array");
	if(count($portfolio)==0) throw new Exception("Portfolio is empty");
	array_map(function($p) {
		if(!array_key_exists("o",$p)) throw new Exception("Portfolio missing o key");
		if(!array_key_exists("q",$p)) throw new Exception("Portfolio missing q key");
		if(!is_int($p["q"])) throw new Exception("quantity should be numeric integer");
		if(! $p["o"] instanceof BlackScholes ) throw new Exception("Portfolio should be array of BlackScholes objects");
	}, $portfolio);

	// test no duplicates
	$ids=array_map(function($p) { return $this->portfolioId($p["o"]); },$portfolio);
	if(count($ids)!=count(array_unique($ids))) throw new Exception("Duplicate options in portfolio detected");

	// portfolio being keyed by portfolio ID and stored in class member
	$this->portfolio=array();
	foreach($portfolio as $p) $this->portfolio[$this->portfolioId($p["o"])]=$p;
}

function portfolioId($p) {
// pass $this->portfolio[i]["o"]
	return "".$p->call_put_flag."_".$p->X."_".$p->r."_".$p->v."_".$p->T;
}

function loss($S,$t,$mult=1) {
// $S: underlying value
// $t: physical time
// $mult: factor with which to multiply the loss... useful for this->margin

	if(!is_numeric($mult)) throw new Exception("mult should be numeric");
	return $this->loss2($this->loss1($S,$t),$mult,$S,$t);
}

function loss1($S,$t) {
// sub-function of loss
	$vals=array();
	foreach($this->portfolio as $id=>$p) {
		$v=$p["o"]->value($S,$t);
		if(is_array($v)) {
			$q=$p["q"];
			// 1st dimension: S
			$v=array_map(function($vi) use($q) {
				if(is_array($vi)) {
					// 2nd dimension: t
					return array_map(function($vii) use($q) { return $vii*$q; },$vi);
				} else {
					return $vi*$q;
				}
			}, $v); 
		} else {
			$v=$v*$p["q"];
		}

		// swap dimensions of options with (S,t)
		if(is_array($v)) {
			foreach($v as $ki=>$vi) {
				if(!array_key_exists($ki,$vals)) $vals[$ki]=array();
				if(is_array($vi)) {
					foreach($vi as $kii=>$vii) {
						if(!array_key_exists($kii,$vals[$ki])) $vals[$ki][$kii]=array();
						$vals[$ki][$kii][$id]=$vii;
					}
				} else {
					$vals[$ki][$id]=$vi;
				}
			}
		} else {
			$vals[$id]=$v;
		}
	}

	return $vals;
}

function loss2($vals,$mult,$S,$t) {
// sub-function of loss
	if(!is_array($S)&&!is_array($t)) {
		$vals = array_sum($vals);
		$vals = min($vals,0)*$mult;
	} else {
		if(is_array($S)&&is_array($t)) {
			foreach($vals as $ki=>$vi) {
				foreach($vi as $kii=>$vii) {
					$vii = array_sum($vii);
					$vii = min($vii,0)*$mult;
					$vals[$ki][$kii] = $vii;
				}
			}
		} else {
			if(!is_array($S)||!is_array($t)) {
				foreach($vals as $ki=>$vi) {
					$vi = array_sum($vi);
					$vi = min($vi,0)*$mult;
					$vals[$ki] = $vi;
				}
			} else {
				throw new Exception("WTF");
			}
		}
	}
	return $vals;
}

function margin($S,$t) {
	$m=$this->loss($S,$t,-1);

	if(!is_array($S)&&!is_array($t)) {
		if(count($this->portfolio)==1) return $m; // this would be numeric in this case
		return $m;
	} else {
		if(is_array($S)&&is_array($t)) {
			return max(max($m));
		} else {
			if(!is_array($S)||!is_array($t)) {
				return max($m);
			} else {
				throw new Exception("WTF");
			}
		}
	}
}

} // end class
