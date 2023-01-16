//var query_code = "h_19120";
var filename = "patient_data_2.csv";  // This filename is used for patient timeline input
var f1 = "patient_data_3.csv";  
var f2 = "patient_data.csv";  

var searchCode = query_code;  // This search code is used for coloring node in patient timeline

/**
***  You are loading variables in index.html file (i.e. selected_code = window.selected_code, cosine_code = window.cosine_code;)
**/

var legend_typ1 = "claim with only selected code, "+ selected_code;
var legend_typ2 = "claim with selected code, "+ selected_code +"  and query code, "+ query_code ;
console.log(legend_typ2);



/////////////////////////////////////////////////////////
var db_value = "a";
function getCodeIDsForAcalim_from_DB(str) {
	
	var request = new XMLHttpRequest();
	request.open('GET',  "php/get_code_for_a_claim.php?q="+str, false);  // `false` makes the request synchronous
	request.send(null);

		if (request.status === 200) {
			db_value = request.responseText;
			//console.log(request.responseText);
		}
}
/////////////////////////////////////////////////////////


var claim = [];
var claimID_calcuated_list = [];



var count1 = 0;
for(var ii =0 ; ii< common_claimID.length ; ii++){
	if (count1>=25)
		break;
	
	var claimID = common_claimID[ii];
	// common_claimID means the claim has both query code and selected code. so, we don't need to search query_code in claim
	
	getCodeIDsForAcalim_from_DB( claimID );
	code_list = db_value.split(";");
	
	claim.push( code_list  );       // Inserting array of codes	
	count1+=1;
	claimID_calcuated_list.push( claimID );
}



// Taking 50 random ID from the list
// The claim will contain selected_code by default
// we need to search 25 claims for query_code
var count1 = 0;
for(var ii =0 ; ii< claimIDlist.length; ii+=2 ){   // just skipping some claims
	if (count1>=25 )
		break;
	
	var claimID = claimIDlist[ii];
	
	getCodeIDsForAcalim_from_DB( claimID );
	code_list = db_value.split(";");
	
	// checking if the claim is already taken or not
	var flag = 0;
	for (var jj =0 ;jj< claimID_calcuated_list.length; jj++){
		if( claimID_calcuated_list[jj]== claimID){
			flag = 1;
			break;
		}
	}
	
	if( flag==0 && count1<25 ){
		claim.push( code_list  );       // Inserting array of codes	
		count1+=1;
		claimID_calcuated_list.push( claimID );
	}
	
	//console.log( "db ");
	//console.log( code_list);
}
console.log( count1);
console.log( claimID_calcuated_list.length);
console.log( claim.length);

var claim_vec = [];   // for n claims, there are n points, n vectors

for (var ii =0; ii< claimID_calcuated_list.length ; ii++){  // ********** I am not sure, why it didnt work for claim.length -1
	var oneclaim = claim[ii];
    var sumvec = new Array( cosine_codevector[ 0 ].length );
    var firstValue = 0;
    for (var jj =0; jj< oneclaim.length ; jj++){  
        var code = oneclaim[jj];
		
		
        var index = cosine_code.indexOf( code) ;
		if ( index <1 )      // if code is not in vector dict, index is -1
                continue;
        if ( code.startsWith( "h" ) )
                continue;
            
        if (firstValue==1)
            continue;       // just taking one vector
        
        if (firstValue ==0 ){
            for( var kk =0; kk<cosine_codevector[ index].length; kk++ ){
                sumvec[kk] = cosine_codevector[ index][kk];
            }         
			firstValue =1;	
        }
        else{
            // add with value with prev vector
            for( var kk =0; kk<cosine_codevector[ index].length; kk++ ){
                sumvec[kk] += cosine_codevector[ index][kk];
            }
        }
    }
	
    // end of reading one claim
	if(firstValue==1){  // we have some codes
		claim_vec.push( sumvec );
	}
}    
// *****************************************************
// ************** Calling T-SNE ************************
// ****** You also need to add tsne.js file ************
var opt = {}
opt.epsilon = 10; 		// epsilon is learning rate (10 = default)
opt.perplexity = 10;	// roughly how many neighbors each point influences (30 = default)
opt.dim = 2;			// dimensionality of the embedding (2 = default)

var tsne = new tsnejs.tSNE(opt); // create a tSNE instance
tsne.initDataDist(claim_vec);
for(var k = 0; k < 700; k++) {
  tsne.step(); // every time you call this, solution gets better
}
var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot

var myData = [];
for (var ii =0; ii< Y.length; ii++){  // ********** I am not sure, why it didnt work for claim.length -1
    var description = "";
    var typ= legend_typ1;
    var oneclaim = claim[ii];    
    for (var jj =0; jj< oneclaim.length; jj++){
        var code = oneclaim[jj];
        var index = cosine_code.indexOf( code) ;
		if (index< 1)
			continue;
		var code_des = cosine_codeDescription[ index];
		if( code_des.length > 30){
			code_des = code_des.substring(0, 30)+" ...";
		}
        description+= code +": "+ code_des +"<br>";
        if (code == query_code)
            typ= legend_typ2;
    }

    myData.push({
			"id": ii,
			"Xvalue": Y[ ii ][0],
			"Yvalue": Y[ ii ][1],
			"Code Name": ii, 
			"claimID": claimID_calcuated_list[ ii ],
            "type": typ,
			"descript": description
		});
}
// *************************************************************************
// *************************************************************************
var margin = { top: 40, right: 5, bottom: 5, left: 5 },
    outerWidth = 500, //original value: 1000, 1200 also a good value
    outerHeight = 250, //original value: 550, 625 also a good value
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

    
var xMax = d3.max(myData, function(d) { return d.Xvalue; }) *1.03,
xMin = d3.min(myData, function(d) { return d.Xvalue; }) *1.05,
xMin = xMin > 0 ? 0 : xMin,
yMax = d3.max(myData, function(d) { return d.Yvalue; }) *1.03,
yMin = d3.min(myData, function(d) { return d.Yvalue; }) *1.05,
yMin = yMin > 0 ? 0 : yMin;

x.domain([xMin, xMax]);
y.domain([yMin, yMax]);

console.log("Max pints");
console.log(xMax);
console.log(xMin);
console.log(yMax);
console.log(yMin);



var xAxis = d3.svg.axis()
.scale(x)
.orient("bottom")
.tickSize(-height);

var yAxis = d3.svg.axis()
.scale(y)
.orient("left")
.tickSize(-width);

var radius = 8 * Math.sqrt(1/Math.PI);

var color = d3.scale.category10(); 			// Ashis: set the automatic color on each category

var legend_code_text = [legend_typ1,legend_typ2];
// ****************************   showing message on mouse hover of points

var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-10, 0])
	.html(function(d) {
				return d.descript;    
		});



var zoomBeh = d3.behavior.zoom()
			.x(x)
			.y(y)
			.scaleExtent([0.8, 10])
			.on("zoom", zoom);

var svg = d3.select("#scatter")
			.append("svg")
			.attr("width", outerWidth)
			.attr("height", outerHeight)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.call(zoomBeh);

svg.call(tip);

svg.append("rect")
			.attr("width", width)
			.attr("height", height)
			.attr("stroke-width", 1)
			.attr("stroke", "gray");   // giving a box area for the points/circles
		
									
									
									
var objects = svg.append("svg")
.classed("objects", true)
.attr("width", width)
.attr("height", height);

var node=objects.selectAll(".dot")
.data(myData)					// loading data
.enter().append("g");

//redraw the text
node.append("text")
	.attr("transform", transform1)
	.text(function(d, i) {
		return i; 
		})
	.style("font-size", "8px")
	.style("font-weight", "bold")
	.attr("text-anchor", "middle");
		
node.append("circle")
	.classed("dot", true)
	.attr("visibility", "visible")
	.attr("r", function(d) {
			return 1;
			//return get_rad(d);
		})
	.attr("transform", transform)
	.style("fill", function(d) {
			return color(d.type);
		})
	.on("click", function(d){
					//alert("a");
                    show_visualize(filename); } )
	.on("mouseover", tip.show)
	.on("mouseout", tip.hide);
	


objects.selectAll(".dot").each(function(d) {		// ********************* setting center points of each dot
	d3.select(this).attr("cx", x(d.Xvalue));
	d3.select(this).attr("cy", y(d.Yvalue));
});



var legend = svg.selectAll(".legend")
.data(color.domain())
.enter().append("g")
.classed("legend", true)
.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


// ***************************************** Circle Icon
// ************************************************************
legend.append("circle")
.attr("r", 7)
.attr("cx",  22)
.attr("cy",  -30)
.attr("id", function(d, i) {
		//Ashis: Set ID by ourself. Just added prefix c_  without any meaning (No, it has meaning. c_ is used for circle legend. only text is used for legend text)
		return "c_"+legend_code_text[i];
	})
	.attr("fill", function(d) {
		//Ashis: now here again removing prefix c_

		return color(d3.select(this).attr("id").substring(2, d3.select(this).attr("id").length + 1));
	})
        .attr("stroke-width", 2)
        .attr("stroke", "black")
	;

// ***************************************** Adding legend text
// ************************************************************

legend.append("text")
	//constant controls proximity to dot in the legend
	.attr("x", 30)
	.attr("y",  -30)
	//.attr("y", function(d, i) { return legend_sort(d, i); })
	.attr("dy", ".35em")
	.text(function(d, i) {
		return legend_code_text[i];
		})
	.attr("id", function(d, i) {
		//Ashis: Set ID useing text
		return legend_code_text[i];
	});


function draw_orig() {
	
	//redraw the dots
	node.selectAll(".dot").remove();
	//redraw the text
	node.append("text")
		.attr("transform", transform1)
		.text(function(d, i) {
			return i; 
			})
		.style("font-size", "8px")
		.style("font-weight", "bold")
		.attr("text-anchor", "middle");
	
	node.append("circle")
		.classed("dot", true)
		.attr("visibility", "visible")
		.attr("r", function (d) { return 10; })
		.attr("transform", transform)
		.style("fill", function(d) {
		return color(d.type);
		})
		.attr("stroke-width", 1)
        .attr("stroke", "black") 
		.on("click", function(d, i){
					// ************************************************************************
                    //alert("a");
					var strconfirm = confirm("Do you want to see patient timeline for this selected claim?") //   + d.claimID 
					if (strconfirm == true) {
						/*
						if (d.type == legend_typ2){
							filename = f1; // This filename is used for patient timeline input
						}
						else{
							filename = f2;  // This filename is used for patient timeline input
						}
						
						*/
						
						document.getElementById("patient_timeline_title").innerHTML = "<b>Patient view</b> (for the selected claim #"+ i +" ) ";
						//"<div style='left: 500px; top: 280px; position: absolute;'> Patient timeline	</div>";
						
						document.getElementById("scatter_patient_timeline").innerHTML = "";
						show_visualize(d.claimID);
					}
                } )
		
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);
}


function zoom() {
	svg.select(".x.axis").call(xAxis);
	svg.select(".y.axis").call(yAxis);
	
	svg.selectAll(".dot")
			.attr("transform", transform);
	objects.selectAll("text").each(function(d) {
		if(!d3.select(this).classed("clstr")) {
		d3.select(this).attr("transform", transform1);
		}else{
		d3.select(this).attr("transform", transform_clst);
		}
	});

}


function transform(d) {
return "translate(" + x(d.Xvalue) + "," + y(d.Yvalue) + ")";
}

//this function controls x,y values of text that appears within the scatterplot
//after any sort of modification (zoom, slide) 
function transform1(d) {
return "translate(" + x(d.Xvalue) + "," + (y(d.Yvalue) + 3) + ")"; //the +1 is arbitrary.
}                                                                 //it controls the text's distance from the dot itself.

function transform_rect(d) {
return "translate(" + (x(d.Xvalue) - 3) + "," + (y(d.Yvalue) + 6) + ")";
}

function transform_polyline(d){
return Number((x(d.Xvalue)))     + "," + Number(y(d.Yvalue))       + " " +
	   Number((x(d.Xvalue) - 6)) + "," + Number((y(d.Yvalue) + 6)) + " " +
	   Number((x(d.Xvalue) + 6)) + "," + Number((y(d.Yvalue) + 6));
}

function transform_clst(d) {
var x_offset = 4,
	y_offset = 14;
	return "translate(" + (x(d.centerX) - x_offset) + "," + (y(d.centerY) - y_offset) + ")";
}

// *********************************************************
// *********************************************************

draw_orig();
// ******************************************************************************************************************
// ******************************************************************************************************************
