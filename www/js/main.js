myJsonParse=function(aaa) {
	var oo=JSON.parse(aaa);
	oo.Q=parseInt(oo.Q);
	oo.K=parseInt(oo.K);
	oo.V=Number(oo.V);
	oo.St=parseInt(oo.St);
	if(!oo.hasOwnProperty("Tmt")) alert("No T-t set"); else oo.Tmt=Number(oo.Tmt);
	return oo;
};

// http://stackoverflow.com/questions/5259421/cumulative-distribution-function-in-javascript
function normalcdf(mean, sigma, to) 
{
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}

function pnorm(to) { return normalcdf(0,1,to); }

// calculate option P&L (at maturity)
function mygv2(id,St) {
	var oo=JSON.parse($(id).prop("value"));
	var s=oo.P=="L"?1:(oo.P=="S"?-1:alert("wtf"));
	var vc=Math.max(0,St-oo.K);
	var vp=Math.max(0,oo.K-St);
	var vs=St-oo.K;
	var v=oo.O=="C"?vc:(oo.O=="P"?vp:(oo.O=="S"?St:alert("wtf2"))); // in case of stock, K is for the purchase price of the stock
	var p=oo.O=="C"||oo.O=="P"?oo.V:0;
	return(oo.Q*s*(v-p));
}

// http://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model#Black-Scholes_formula
// assuming interest rates = 0 %
function calcd1(sig,Tmt,S,K,r) { return 1/sig/Math.sqrt(Tmt)*(Math.log(S/K)+(r+Math.pow(sig,2)/2)*Tmt); }
function calcd2(sig,Tmt,S,K,r) { return 1/sig/Math.sqrt(Tmt)*(Math.log(S/K)+(r-Math.pow(sig,2)/2)*Tmt); }

// calculate option price curve versus underlying (using Black-Scholes and implied vol=25% and interest rates=0%)
// http://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model#Black-Scholes_formula
// Tmt is the number of years to maturity, e.g. 14 months = 14/12
// r=0 makes futures options similar to options on securities(the formula is modified for futures options   http://web.am.qub.ac.uk/users/m.s.kim/chap7.pdf  )
// Interest rates could be obtained from the table built-in the Eurex program: Settings / Interest Rates (minimize the subwindow to see the menu)
// but the effect is minimal really
// St is the underlying
function mygv(id,St) {
	var oo=myJsonParse($(id).prop("value"));
	if(oo.Tmt==0) return mygv2(id,St);
	var s=oo.P=="L"?1:(oo.P=="S"?-1:alert("wtf"));
	var r=0;//0.005;
	var impVol=parseInt($("#impVol").val());
	var d1=calcd1(impVol/100,oo.Tmt,St,oo.K,r);
	var d2=calcd2(impVol/100,oo.Tmt,St,oo.K,r);
	var vc=pnorm(d1)*St-pnorm(d2)*oo.K*Math.pow(Math.E,-r*oo.Tmt); 
	var vp=pnorm(-1*d2)*oo.K*Math.pow(Math.E,-r*oo.Tmt)-pnorm(-1*d1)*St;	//console.log("vc="+vc+",vp="+vp);
	var vs=St-oo.K;
	var v=oo.O=="C"?vc:(oo.O=="P"?vp:(oo.O=="S"?St:alert("wtf2"))); // in case of stock, K is for the purchase price of the stock
	var p=oo.O=="C"||oo.O=="P"?oo.V:0;
	var Tmt=oo.Tmt;
	return(oo.Q*s*(v-p));
}

//
function thalesTheorem_yn(x1,y1,x2,y2,xn) {
	if(y2==y1) { // flat horizontal line
		return y1;
	} else if(x2==x1) { // vertical line
		return y1; // choosing arbitrary point
	} else {
		x0=y1-(y2-y1)/(x2-x1)*x1;
		xy0=-x0*(x2-x1)/(y2-y1);
		return y1*(xn-xy0)/(x1-xy0);
	}
}

//
function searchCosPoints(v,a) {
  // assumes that cosPoints[i][1] are sorted in increasing order
  for(var i=0;i<v.length;i++) {
    if(v[i][0]<=a && v[i+1][0]>=a) {
		//console.log("here",v[i][0]+','+v[i][1]+';'+a+',?;'+v[i+1][0]+','+v[i+1][1]);
		return(thalesTheorem_yn(v[i][0],v[i][1],v[i+1][0],v[i+1][1],a));
	}
  }
  return(0);
}

//
function draw() {
  // calculate strategy P&L
  var cosPoints = []; 
  for (var i=0; i<250; i+=0.25){ 
	var sum={x:0};
	$('input[type="checkbox"]').each(function(iteration,item) {
		aa=item.checked?mygv("#"+item.id,i):0;
		sum.x+= aa;
	});
     cosPoints.push([i,sum.x]); 
  } 
  var St={St:0};
	$('input[type="checkbox"]').each(function(iteration,item) {
		St.St=myJsonParse($("#"+item.id).prop("value")).St;
	}); // as a matter of fact, taking St of any of those would have worked, so no need to iterate
	St=St.St;

  // risk is +- 7 %
  if($("#rd").length != 0) {
    var rd=$("#rd").val()/100;
  } else { var rd=0.07; }
  
  // search for maximum loss between 0.8*St and 1.2*St
  // Go from left to center, then from right to center. This ensures that the minimum closest to the center is chosen
  var cpSt_min_i=0;
  var cpSt_min=9999999999999999; // infinity
  // Go from left to center
  for(var j=0;j<cosPoints.length;j++) {
	var i=cosPoints[j][0];
	var cpSt_x=cosPoints[j][1];
	if(i>=St*(1-rd) && i<=St && cpSt_x<=cpSt_min) {
		cpSt_min=cpSt_x;
		cpSt_min_i=i;
	}
  }
  // Go from right to center
  for(var j=cosPoints.length-1;j>=0;j--) {
	var i=cosPoints[j][0];
	var cpSt_x=cosPoints[j][1];
	if(i>=St && i<=(1+rd)*St && cpSt_x<=cpSt_min) {
		cpSt_min=cpSt_x;
		cpSt_min_i=i;
	}
  }
  
  // plotting and displaying information
  var cpSt    =searchCosPoints(cosPoints,St    );
  var chartPlots = [
	cosPoints,
//	[[cpSt_min_i,cpSt_min],[St,cpSt]],
	//[[cpSt_min_i,cpSt_min],[cpSt_min_i,0]],
	[[St,cpSt]],
	[[cosPoints[0][0],0],[cosPoints[cosPoints.length-1][0],0]],
	[[St,0],[St,cpSt]],
	[[cpSt_min_i,cpSt_min],[cpSt_min_i,0]]
	];
  var risk2=Math.min(0,Math.round(cpSt*100)/100);
  var risk=Math.min(0,Math.round(cpSt_min*100)/100);
 $("#mrStandard").text(risk2);
 $("#mrConservative").text(risk);
  // make plot
  $("#chart3").empty();
  var plot3 = $.jqplot('chart3', chartPlots, {  
      series:[{showMarker:false}],
      title: 'P&L<br> Margin:<br> standard = 100 x '+risk2+'<br> conservative = 100 x '+risk,
      axes:{
        xaxis:{
          label:'S_T',
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          labelOptions: {
            fontFamily: 'Georgia, Serif',
            fontSize: '12pt'
          },
//	      min: 50,
//	      max: 200
        },
        yaxis:{
          labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
          labelOptions: {
            fontFamily: 'Georgia, Serif',
            fontSize: '12pt'
          },
//	      min: -210,
//	      max: +210
        }
	  }, // end axes
      cursor:{
        show: true,
        zoom:true,
        tooltipLocation:'sw'
        }
  });

  // write the margin requirement
//  if( ($("#c1").prop("checked")||$("#p1").prop("checked"))&&!($("#c2").prop("checked")|$("#p2").prop("checked")|$("#s").prop("checked")) ) $("#mr").text("0");
};

//
//var port; //=JSON.parse('[{"P":"L","Q":1,  "K":125,"O":"C","V":3.75,"St":125},{"P":"S","Q":1,  "K":30, "O":"C","V":0.0625,"St":125},{"P":"S","Q":1,  "K":90, "O":"P","V":7,"St":125},{"P":"L","Q":3,        "O":"S","V":0,"St":125}]');
function handlePort(port) {
	if(!$.isArray(port)) port=JSON.parse(port);

	$("#ol").empty();
	$.each(port, function(iteration,item) {
		// update item Tmt to remove the physical time passed
               item.Tmt=item.TMaturity-$('#tPhysical').val();
               // Not doing Math.max to distinguish between expired and at expiry // item.Tmt=Math.max(0,item.TMaturity-$('#tPhysical').val());^M
               // check if expired
               expired=item.Tmt<0;

		// list
		$("#ol").append(
			$(document.createElement("li")
			).attr({
				"style":(expired?"background-color:red":"")
			}).append(
				$(document.createElement("input")).attr({
					"id":'o'+iteration,
					"type":"checkbox",
					"class":"cb",
					"value":JSON.stringify(item),
					"checked":!expired // false if expired
				})
			).append(
				(item.P=="L"?"Long":"Short")
				+" "+item.Q+"x"
				+(item.O=="C"||item.O=="P"?" T-t="+item.Tmt+" years":"")
				+" "+item.K
				+(item.O=="C"?" Call":(item.O=="P"?" Put":" Security"))
				+(item.O=="C"||item.O=="P"?" at "+item.V:"")
				+" (underlying at "+item.St+")"
				//+", "+item.Comment+")"
				+", Expired: "+(expired?"Yes":"No")
			)
		);
	});
	$(".cb").on("click", draw);

	$('#impVolText').text($('#impVol').val());
	$('#TMaturityText').text($('#TMaturity').val());
	$('#underlyingText').text($('#St').val());
	$('#rdText' ).text($('#rd').val());
	$('#rdText2').text($('#rd').val());
	$('#tPhysicalText').text($('#tPhysical').val());

	draw();
};

//
function doRetrieve() {
	// inspired by ajaxMgmt.jsa
	reqJson('visOpt/getClientPortfolioForVis.html',
		'mainContent',
		'dd='+document.getElementById('ddFree').value+'&client.base='+document.getElementById('client.base').value+'&cid='+document.getElementById('cid').value+'&secId='+document.getElementById('secId').value+'&format=json',
		false,
		handlePort);
}

// \Todo why doesn't this work here and only works in window.load in ajaxMgmt.js?
//$(document).ready(function() {
//	req('am/list.validAccountIds.html','cid','client.base=Lebanon&format=json');
//alert("bla");
//});
