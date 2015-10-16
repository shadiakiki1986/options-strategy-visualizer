# options-strategy-visualizer
* Small tool that plots the total payoff of a strategy combining financial call/put options and/or the underlying
* [![Build Status](https://secure.travis-ci.org/shadiakiki1986/options-strategy-visualizer.png)](http://travis-ci.org/shadiakiki1986/options-strategy-visualizer)

# Motivation
The reason I wrote this tool is that after some [research](http://lmgtfy.com/?q=options+strategy+visualize) for an online tool that visualizes option strategies, I didn't find anything useful.

Its calculations are based on CBOE's [rulebook](http://www.cboe.com/micro/margin/strategy.aspx) (p 18)

Here is a list of pages that I checked out before I decided to do this myself
* https://discoveroptions.com/mixed/content/education/articles/riskgraphs.html 
* http://www.intrepid.com/robertl/strategies1.html
* http://www.mathworks.com/matlabcentral/fileexchange/17411-visualize-payoffs-of-an-option-strategy/content/butterfly.m
* http://www.optiontradingtips.com/options101/payoff-diagrams.html

# Usage
* Browse at http://shadiakiki1986.github.io/options-strategy-visualizer/
 * It used to be hosted at http://genesis.akikieng.com/options-strategy-visualizer

# Logo
I chose the letter '''V''' to be the logo for this tool.

It represents 
* the first letter of the word '''visualizer''' 
* the payoff of a long [straddle](https://en.wikipedia.org/wiki/Straddle) position
* one of my [favorite movies](https://en.wikipedia.org/wiki/V_for_Vendetta)

# License
Licensed under [WTFPL](http://www.wtfpl.net/)

# Developer notes
## Testing
* Testing of php API: phpunit tests
* Testing of nodejs API: npm install --dev && npm test

## gh-pages
Created github pages branch
* git checkout --orphan gh-pages
* git rm * -rf
* echo "whatever" > index.html && git add index.html
* git commit -a -m "first gh-pages commit"
* git push
* git branch # will now show the gh-pages branch and the master branch
* git checkout master # to switch
* git checkout gh-pages # to switch
* [Reference](https://help.github.com/articles/creating-project-pages-manually/)

## initial php API
* The initial php API was discontinued in favor of nodejs api that I can use with AWS lambda (versus the need to have an EC2 instance running for the php api)
* check discontinued-php branch for files

## updating common js code between nodejs and gh-pages browser client
The gh-pages javascript files use common code with the nodejs files
* for this I use browserify
* in branch master: npm run build ([source](https://github.com/substack/browserify-handbook#watchify))
* switch to gh-pages: git checkout gh-pages
* git status will show that the js/OptStratVis.js has been modified
* git commit -a -m "updating optstratvis.js library file"
* git push
* more notes here later

## first checkout of remote branch locally
git checkout -b gh-pages origin/gh-pages

## Google analytics
I just added my personal email's google analytics tracking ID of my github pages to this SPA
