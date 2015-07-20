# options-strategy-visualizer
* Small tool that plots the total payoff of a strategy combining financial call/put options and/or the underlying
* [![Build Status](https://secure.travis-ci.org/shadiakiki1986/options-strategy-visualizer.png)](http://travis-ci.org/shadiakiki1986/options-strategy-visualizer)

# Motivation
The reason I wrote this tool is that after some [research](http://lmgtfy.com/?q=options+strategy+visualize) for an online tool that visualizes option strategies, I didn't find anything useful.

This tool is hosted [here](http://genesis.akikieng.com/options-strategy-visualizer)

Its calculations are based on CBOE's [rulebook](http://www.cboe.com/micro/margin/strategy.aspx) (p 18)

Here is a list of pages that I checked out before I decided to do this myself
* https://discoveroptions.com/mixed/content/education/articles/riskgraphs.html 
* http://www.intrepid.com/robertl/strategies1.html
* http://www.mathworks.com/matlabcentral/fileexchange/17411-visualize-payoffs-of-an-option-strategy/content/butterfly.m
* http://www.optiontradingtips.com/options101/payoff-diagrams.html


# Logo
I chose the letter '''V''' to be the logo for this tool.

It represents 
* the first letter of the word '''visualizer''' 
* the payoff of a long [straddle](https://en.wikipedia.org/wiki/Straddle) position
* one of my [favorite movies](https://en.wikipedia.org/wiki/V_for_Vendetta)

# License
Licensed under [WTFPL](http://www.wtfpl.net/)

# Testing of php API

    phpunit tests

# Testing of nodejs API

    npm install --dev
    npm test


