<?php

require_once dirname(__FILE__).'/../root.php';
require_once ROOT.'/src/BlackScholes.php';

class BlackScholesTest extends PHPUnit_Framework_TestCase
{

    public function testExpiryCall() {
	$bs1=new BlackScholes('C',80,0,0.25,0);
	$this->assertTrue($bs1->value(120,0)==40);
	$this->assertTrue($bs1->value(100,0)==20);
	$this->assertTrue($bs1->value(80,0)==0);
	$this->assertTrue($bs1->value(60,0)==0);
    }

    public function testExpiryPut() {
	$bs1=new BlackScholes('P',80,0,0.25,0);
	$this->assertTrue($bs1->value(120,0)==0);
	$this->assertTrue($bs1->value(100,0)==0);
	$this->assertTrue($bs1->value(80,0)==0);
	$this->assertTrue($bs1->value(60,0)==20);
	$this->assertTrue($bs1->value(40,0)==40);
    }

    public function testVector() {
	$bs1=new BlackScholes('C',80,0,0.25,0.4);
	$x1=$bs1->value(array(40,60,80,100,120),0);
	$this->assertTrue(count($x1)==5);
	$x2=$bs1->value(90,array(0,0.1,0.2,0.3,0.4));
	$this->assertTrue(count($x2)==5);
    }

    public function testTensor() {
	$bs1=new BlackScholes('C',80,0,0.25,0.4);
	$x3=$bs1->value(array(40,60,80,100,120),array(0,0.1,0.2,0.3,0.4));
	$this->assertTrue(count($x3)==5);
	foreach($x3 as $k=>$x3i) {
		$this->assertTrue(count($x3i)==5);
	}
    }

    public function testConvexPriceCall() {
	$bs1=new BlackScholes('C',80,0,0.25,0.1);
	$S=array(40,60,80,100,120);
	$x1=$bs1->value($S,0);
	sort($S); //make sure S is sorted
	for($i=0;$i<count($S)-1;$i++) $this->assertTrue( $x1[(string)$S[$i]] < $x1[(string)$S[$i+1]]);
	// check that this slope is less than 1
	$this->assertTrue(($x1["120"]-$x1["80"])/(120-80)<1);
    }

    public function testConvexPricePut() {
	$bs1=new BlackScholes('P',80,0,0.25,0.1);
	$S=array(40,60,80,100,120);
	$x1=$bs1->value($S,0);
	sort($S); //make sure S is sorted
	for($i=0;$i<count($S)-1;$i++) $this->assertTrue( $x1[(string)$S[$i]] > $x1[(string)$S[$i+1]]);
	// check that this slope is less than 1
	$this->assertTrue(($x1["80"]-$x1["40"])/(80-40)<1);
    }

    public function testSlopePriceCall() {
	// check that this slope is less than 1
	$bs1=new BlackScholes('C',80,0,0.25,0.1);
	$x1=$bs1->value(array(80,120),0);
	$this->assertTrue(($x1["120"]-$x1["80"])/(120-80)<1);
    }

    public function testSlopePricePut() {
	// check that this slope is less than 1
	$bs1=new BlackScholes('P',80,0,0.25,0.1);
	$x1=$bs1->value(array(40,80),0);
	$this->assertTrue(($x1["80"]-$x1["40"])/(80-40)<1);
    }

    public function testConvexPriceAndMaturityCall() {
	$bs1=new BlackScholes('C',80,0,0.25,0.4);
	$S=array(40,60,80,100,120);
	$t=array(0.1,0.2,0.3);
	$x1=$bs1->value($S,$t);
	sort($S); //make sure S is sorted
	sort($t); //make sure t is sorted
	for($i=0;$i<count($S)-1;$i++) 
		for($j=0;$j<count($t)-1;$j++) 
			$this->assertTrue(
				$x1[(string)$S[$i]][(string)$t[$j  ]]
				>
				$x1[(string)$S[$i]][(string)$t[$j+1]]
			);
	for($i=0;$i<count($t)-1;$i++) 
		for($j=0;$j<count($S)-1;$j++) 
			$this->assertTrue(
				$x1[(string)$S[$j  ]][(string)$t[$i]]
				<
				$x1[(string)$S[$j+1]][(string)$t[$i]]
			);

    }

    public function testCallPremium() {
	$bs1=new BlackScholes('C',80,0,0.25,0,2.12);
	$this->assertTrue($bs1->value(120,0)==40-2.12);
	$this->assertTrue($bs1->value(100,0)==20-2.12);
	$this->assertTrue($bs1->value(80,0)==0-2.12);
	$this->assertTrue($bs1->value(60,0)==0-2.12);
    }

}
