<?php

header("Access-Control-Allow-Origin: *");

/*
 Margin required on an options strategy

 USAGE
	CLI	php optionsStrategyMargin.php 100 0 '[{"Q": 1,"O":"C","K": 70,"r":0,"v":0.25,"T":0.2},{"Q":-1,"O":"C","K": 80,"r":0,"v":0.25,"T":0.2}]'
		php optionsStrategyMargin.php 100 0 '[{"Q":-1,"O":"C","K": 70,"r":0,"v":0.25,"T":0.2},{"Q": 1,"O":"C","K": 80,"r":0,"v":0.25,"T":0.2}]'
		php optionsStrategyMargin.php 125 0 '[{"Q":-1,"O":"C","K":125,"r":0,"v":0.25,"T":0.2},{"Q": 1,"O":"C","K":100,"r":0,"v":0.25,"T":0.2}]'

	AJAX
		 $.ajax({
		    url:'http://shadi.ly/zboota-server/api/optionsStrategyMargin.php?S=100&t=0.2&port=[{"Q":1,"O":"C","K":70,"r":0,"v":0.25},{"Q":-1,"O":"C","K":80,"r":0,"v":0.25}]',
		    success: function (data) {
			console.log(data);
		    },
		    error: function (jqXHR, ts, et) {
			console.log("error", ts, et);
		    }
		 });
*/

if(isset($argc)) {
	if($argc<3) throw new Exception("Usage: php optionsStrategyMargin.php underlying Tmt portfolio");
	$S=$argv[1];
	$t=$argv[2];
	$port=$argv[3];
} else {
	if(!array_key_exists("S",$_GET)||!array_key_exists("t",$_GET)||!array_key_exists("port",$_GET)) throw new Exception("Wrong usage of GET");
	$S=$_GET["S"];
	$t=$_GET["t"];
	$port=$_GET["port"];
}

require_once dirname(__FILE__).'/../../root.php';
require_once ROOT.'/src/OptionsStrategy.php';
require_once ROOT.'/src/BlackScholes.php';

if($port=="") throw new Exception("Please enter your portfolio.\n");
if($S=="") throw new Exception("Please enter underlying.\n");
if($t=="") throw new Exception("Please enter maturity.\n");

// read from json
$port=json_decode($port,true);
// convert to objects
$S=(float)$S;
$t=(float)$t;
$port2=array();
foreach($port as $pi) array_push($port2,array("q"=>$pi["Q"],"o"=>new BlackScholes($pi["O"],$pi["K"],$pi["r"],$pi["v"],$pi["T"],$pi["V"])));

// build vector of S around underlying
$Sx=range(0,2*$S,1);

try {
	// calculate
	$zc=new OptionsStrategy($port2);
	echo round($zc->margin($Sx,$t)*100)/100;
} catch (Exception $e) {
        echo $e->getMessage();
        return;
}

