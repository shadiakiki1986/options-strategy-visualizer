<?php

require_once dirname(__FILE__).'/../root.php';
require_once ROOT.'/src/OptionsStrategy.php';

class OptionsStrategyTest extends PHPUnit_Framework_TestCase
{

    public function testLongCall() {
	$bs1=new OptionsStrategy(array(array("q"=>1,"o"=>new BlackScholes('c',80,0,0.25))));
	$this->assertTrue($bs1->loss(120,0)==0);
	$this->assertTrue($bs1->loss(100,0)==0);
	$this->assertTrue($bs1->loss(80,0)==0);
	$this->assertTrue($bs1->loss(60,0)==0);
    }

    public function testShortCall() {
	$bs1=new OptionsStrategy(array(array("q"=>-1,"o"=>new BlackScholes('c',80,0,0.25))));
	$this->assertTrue($bs1->loss(120,0)==-40);
	$this->assertTrue($bs1->loss(100,0)==-20);
	$this->assertTrue($bs1->loss(80,0)==0);
	$this->assertTrue($bs1->loss(60,0)==0);
    }

    public function testDupes() {
	try {
		$bs1=new OptionsStrategy(array(array("q"=>2,"o"=>new BlackScholes('c',80,0,0.25))));
	} catch(Exception $e) {
		$this->assertTrue($e->getMessage()=="Duplicate options in portfolio detected");
	}
    }

    public function testLong2xCall() {
	$bs2=new OptionsStrategy(array(array("q"=>2,"o"=>new BlackScholes('c',80,0,0.25))));
	$this->assertTrue($bs2->loss(120,0)==0);
	$this->assertTrue($bs2->loss(100,0)==0);
	$this->assertTrue($bs2->loss(80,0)==0);
	$this->assertTrue($bs2->loss(60,0)==0);
    }

    public function testShort2xCall() {
	$bs1=new OptionsStrategy(array(array("q"=>-2,"o"=>new BlackScholes('c',80,0,0.25))));
	$this->assertTrue($bs1->loss(120,0)==-80);
	$this->assertTrue($bs1->loss(100,0)==-40);
	$this->assertTrue($bs1->loss(80,0)==0);
	$this->assertTrue($bs1->loss(60,0)==0);
    }

    public function testQtyZero() {
	$bs2=new OptionsStrategy(array(array("q"=>0,"o"=>new BlackScholes('c',80,0,0.25))));
	$this->assertTrue($bs2->loss(120,0)==0);
	$this->assertTrue($bs2->loss(100,0)==0);
	$this->assertTrue($bs2->loss(80,0)==0);
	$this->assertTrue($bs2->loss(60,0)==0);
    }

    public function testLongPut() {
	$bs1=new OptionsStrategy(array(array("q"=>1,"o"=>new BlackScholes('p',80,0,0.25))));
	$this->assertTrue($bs1->loss(120,0)==0);
	$this->assertTrue($bs1->loss(100,0)==0);
	$this->assertTrue($bs1->loss(80,0)==0);
	$this->assertTrue($bs1->loss(60,0)==0);
    }

    public function testShortPut() {
	$bs1=new OptionsStrategy(array(array("q"=>-1,"o"=>new BlackScholes('p',80,0,0.25))));
	$this->assertTrue($bs1->loss(120,0)==0);
	$this->assertTrue($bs1->loss(100,0)==0);
	$this->assertTrue($bs1->loss(80,0)==0);
	$this->assertTrue($bs1->loss(60,0)==-20);
    }

    public function testMarginNumeric() {
	// test that margin is always numeric

	$bs1=new OptionsStrategy(array(array("q"=>1,"o"=>new BlackScholes('p',80,0,0.25))));
	$x=$bs1->margin(60,0);
	$this->assertTrue(is_numeric($x));

	$bs1=new OptionsStrategy(array(array("q"=>1,"o"=>new BlackScholes('p',80,0,0.25))));
	$x=$bs1->margin(array(60,80,100,120),0);
	$this->assertTrue(is_numeric($x));

	$bs1=new OptionsStrategy(array(array("q"=>1,"o"=>new BlackScholes('p',80,0,0.25))));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue(is_numeric($x));

	$bs1=new OptionsStrategy(array(
		array("q"=> 1,"o"=>new BlackScholes('p',80,0,0.25)),
		array("q"=>-1,"o"=>new BlackScholes('p',90,0,0.25))
	));
	$x=$bs1->margin(60,0);
	$this->assertTrue(is_numeric($x));
    }

    public function testVector() {
	$bs1=new OptionsStrategy(array(array("q"=>1,"o"=>new BlackScholes('p',80,0,0.25))));
	$x=$bs1->loss(array(60,80,100,120),0);
	$this->assertTrue(count($x)==4);
    }

    public function testShortCallVector() {
	$bs1=new OptionsStrategy(array(array("q"=>-1,"o"=>new BlackScholes('c',80,0,0.25))));
	$x=$bs1->margin(array(60,80,100,120),0);
	$this->assertTrue($x==40);
    }

    public function testTensor() {
	$bs1=new OptionsStrategy(array(array("q"=>1,"o"=>new BlackScholes('p',80,0,0.25))));
	$x3=$bs1->loss(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue(count($x3)==4);
	foreach($x3 as $k=>$x3i) {
		$this->assertTrue(count($x3i)==3);
	}
    }

    public function testShortCallTensor() {
	$bs1=new OptionsStrategy(array(array("q"=>-1,"o"=>new BlackScholes('c',80,0,0.25))));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue($x>40 && $x<41);
    }

    public function testStraddleLong() {
	$bs1=new OptionsStrategy(array(
		array("q"=>1,"o"=>new BlackScholes('c',80,0,0.25)),
		array("q"=>1,"o"=>new BlackScholes('p',80,0,0.25))
	));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue($x==0);
    }

    public function testStraddleShort() {
	$bs1=new OptionsStrategy(array(
		array("q"=>-1,"o"=>new BlackScholes('c',80,0,0.25)),
		array("q"=>-1,"o"=>new BlackScholes('p',80,0,0.25))
	));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue($x>40&&$x<41);
    }

    public function testSpreadLong() {
	$bs1=new OptionsStrategy(array(
		array("q"=> 1,"o"=>new BlackScholes('c',80,0,0.25)),
		array("q"=>-1,"o"=>new BlackScholes('c',90,0,0.25))
	));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue($x==0);
    }

    public function testSpreadShort() {
	$bs1=new OptionsStrategy(array(
		array("q"=>-1,"o"=>new BlackScholes('c',80,0,0.25)),
		array("q"=> 1,"o"=>new BlackScholes('c',90,0,0.25))
	));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue($x==10);
    }

    public function testCondorLong() {
	$bs1=new OptionsStrategy(array(
		array("q"=>-1,"o"=>new BlackScholes('c',70,0,0.25)),
		array("q"=> 1,"o"=>new BlackScholes('c',80,0,0.25)),
		array("q"=> 1,"o"=>new BlackScholes('c',90,0,0.25)),
		array("q"=>-1,"o"=>new BlackScholes('c',100,0,0.25))
	));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue($x==10);
    }

    public function testCondorShort() {
	$bs1=new OptionsStrategy(array(
		array("q"=> 1,"o"=>new BlackScholes('c',70,0,0.25)),
		array("q"=>-1,"o"=>new BlackScholes('c',80,0,0.25)),
		array("q"=>-1,"o"=>new BlackScholes('c',90,0,0.25)),
		array("q"=> 1,"o"=>new BlackScholes('c',100,0,0.25))
	));
	$x=$bs1->margin(array(60,80,100,120),array(0,0.1,0.2));
	$this->assertTrue($x==0);
    }

    public function testNotBlackScholes() {
	try {
		$bs1=new OptionsStrategy(array(array("q"=>2,"o"=>array(1,2,3,4))));
	} catch(Exception $e) {
		$this->assertTrue($e->getMessage()=="Portfolio should be array of BlackScholes objects");
	}
    }

    public function testQtyNotNumeric() {
	try {
		$bs1=new OptionsStrategy(array(
			array("q"=>-1,"o"=>new BlackScholes('c',80,0,0.25)),
			array("q"=> "1","o"=>new BlackScholes('c',90,0,0.25))
		));
	} catch(Exception $e) {
		$this->assertTrue($e->getMessage()=="quantity should be numeric integer");
	}
    }

}
