/////////////////////////////////////////////////////////
var db_value2 = "b";
var db_value3 = "c";
function getpid_from_DB(claimid) {
	
	var request = new XMLHttpRequest();
	request.open('GET',  "php/get_pid.php?q="+claimid, false);  // `false` makes the request synchronous
	request.send(null);

		if (request.status === 200) {
			db_value2 = request.responseText;
			//console.log(request.responseText);
		}
}
function get_claim_for_a_patient_from_DB(pid) {
	
	var request = new XMLHttpRequest();
	request.open('GET',  "php/get_claim_a_patient.php?q="+pid, false);  // `false` makes the request synchronous
	request.send(null);

		if (request.status === 200) {
			db_value3 = request.responseText;
			//console.log(request.responseText);
		}
}
/////////////////////////////////////////////////////////

function show_visualize(claimIDD){ 
	getpid_from_DB(claimIDD);
	patientIDD = db_value2;
	
	get_claim_for_a_patient_from_DB(patientIDD) ;
	claim_with_time = db_value3;
	claim_with_time = claim_with_time.split(";");
	
	var primary_codeDict = new Object();                // taking a dictionary
	var time_list_timeline = [];
	var claim_list_timeline = [];
	var show_list_timeline = [];
	var colorFlag = [];
	var dataType = [];
	var min_time = 9999999999999;         // the timeline didn't start from 0. I need to scale all data
	
	for( var ii =0; ii< (claim_with_time.length-1 ); ii+=2 ){   // reading two values. 1st is claim, 2nd is time
		claim_id1 = claim_with_time[ii];
		
		//************************************** 
		if(claimIDD == claim_id1)
			colorFlag.push( 1 ); // adding color for query claim	
		else
			colorFlag.push( 0 ); 	
		//**************************************
		
		//**************************************  Converting yyyymmdd format to integer range
		visit_date = claim_with_time[ii+1];
		
		//visit_year = parseInt( visit_date.substring(0,4) );
		//visit_month= parseInt( visit_date.substring(4,6) );
		//visit_day  = parseInt( visit_date.substring(6,8) );
		//visit_time = parseInt( visit_year*365 + visit_month* 30 + visit_day ); // ******* integer parsing		
		//console.log(" ************ "+ visit_date+" | " + visit_year+ " | " + visit_month+ " | " + visit_day + " " + visit_time);
		
		time_list_timeline.push( visit_date  );  
		if(  visit_date < min_time)
			min_time =   visit_date ;
		
		//************************************** adding code and code description for a claim_id
		getCodeIDsForAcalim_from_DB( claim_id1);
		code_list = db_value.split(";");
		var s ="";
		var flag = 0;
		for( var jj =0; jj< code_list.length; jj++){
			 var index = cosine_code.indexOf(  code_list[jj] ) ;
			 if (index< 1)
				continue;
			var code_des = cosine_codeDescription[ index];
			if( code_des.length > 30){
				code_des = code_des.substring(0, 30)+"...";
			}

			s += code_list[jj] +": "+ code_des +"<br>";
			if( code_list[jj].substring(0,2) == "d_" ){
				if(code_list[jj] in primary_codeDict){
					primary_codeDict[ code_list[jj] ] +=1;
				}
				else{
					primary_codeDict[ code_list[jj] ] = 1;
				}
			}
			
		}
		show_list_timeline.push( s );
		
		code_num_primary_code = code_list[0].substring(2);	// cutting first two digits, i.e. "d_"
		dataType.push( code_num_primary_code );
		
	}
	console.log(searchCode);
	console.log("here is ************ ");
	console.log(patientIDD);
	console.log("date: " + time_list_timeline[0]);
	console.log("min date "+min_time);
	total_visits = time_list_timeline.length ;
	console.log("total_visits  " +total_visits );
	document.getElementById("patient_timeline_total_visit").innerHTML = "Total visits: " + total_visits +" <br> [Zoom in/out to see a single visit day]";
	
	
	// ****************************************************************************
	// ****************************************************************************
	// Create items array
	var items = Object.keys( primary_codeDict ).map(function(key) {
	  return [key, primary_codeDict[key]];
	});

	// Sort the array based on the second element
	items.sort(function(first, second) {
	  return second[1] - first[1];
	});
	
	var code_list= "Top five frequent codes:</br><textarea rows='7' cols='45'>Code: &nbsp; Frequency &nbsp; &nbsp; &nbsp; Code description \n";
	var got = 0;
	for(var ii =0 ;ii< 10; ii++){
		var index = cosine_code.indexOf(  items[ii][0] ) ;
		if (index< 1)
				continue;
		
		var code_des = cosine_codeDescription[ index];
		if( code_des.length > 30){
			code_des = code_des.substring(0, 30)+"...";
		}

		code_list += items[ii][0] +": "+ items[ii][1] +" "+ code_des +"\n";
		got+=1;
		if (got ==5)
			break;
	}
	code_list+= "</textarea>";
	document.getElementById("patient_timeline_code").innerHTML = code_list;
	// ****************************************************************************
	// ****************************************************************************
	
	


	
	
	// scalling patint timeline
	for(var ii =0; ii < time_list_timeline.length ; ii++){
		time_list_timeline[ii] = time_list_timeline[ii] - min_time;
	}
	//console.log( time_list_timeline );  // printing all the visit dates
	
	








	// ****************************************************************************
	//**************************************************************************
	var claim_list = "Claim list: (sorted by date)</br><textarea rows='7' cols='42'>";
	var claim_dayDict = new Object(); 

	for(var ii =0; ii< time_list_timeline.length; ii++ ){ 
		claim_dayDict [ parseInt( time_list_timeline[ii])  ] = show_list_timeline[ii];   // converting string to integer
	}

	function sortOnKeys(dict) {

	    var sorted = [];
	    for(var key in dict) {
	        sorted[sorted.length] =  parseInt(key);
	    }
	    sorted.sort();

	    var tempDict = {};
	    for(var i = 0; i < sorted.length; i++) {
	        tempDict[sorted[i]] = dict[sorted[i]];
	    }

	    return tempDict;
	}
	claim_dayDict = sortOnKeys(claim_dayDict);

	for(var key in claim_dayDict){

		claim_list +=  key +"\n";
		var description= claim_dayDict[ key ];
		var description= description.split( "<br>");

		for( var ii =0; ii< description.length ; ii+=1 ){
			claim_list +=  description[ ii ] +"\n";
		}

	}

	claim_list+= "</textarea>";
	document.getElementById("patient_timeline_claimlist").innerHTML = claim_list;
	
	// ****************************************************************************
	// ****************************************************************************
	  









	
	var yaxis_value = ['.','Infectious and parasitic diseases', 'Neoplasms', 'Immunity disorders', 'Blood diseases', 'Mental disorders', 'Nervous system' , 'Sense organs', 'Circulatory system', 'Respiratory system', 'Digestive system', 'Genitourinary system', 'Pregnancy, childbirth', 'Skin diseases', 'Connective tissue', 'Congenital anomalies', 'Perinatal period cond.','Symptoms & signs', 'Injury and poisoning', 'Other'];
	// we don't have all value for a patient
	// we don't want to show lines for non-y_values
	// First row is an empty and we have this value by default
	// Taking flag values for the given file input and selecting y axis values
	var yaxis_value_flag = [1,0,0,0,0 ,0,0,0,0,0   ,0,0,0,0,0   ,0,0,0,0 ];  // Total 19 yaxis values
	
	var margin = { top: 20, right: 20, bottom: 30, left: 180 },		// Set your margin. Suppose, if you extend left value, the scatter graph will go at left
		outerWidth = 600,
		outerHeight = 250,
		width = outerWidth - margin.left - margin.right,
		height = outerHeight - margin.top - margin.bottom;


	// making a dictionary as like csv file format	
	var myDataNEW = [];
	for(var ii =0; ii< time_list_timeline.length; ii++ ){ 

	
		myDataNEW.push({
			id: claim_list_timeline[ii],
			time: time_list_timeline[ii],
			dataType: dataType[ii],
			colorFlag: colorFlag[ii] ,
			show: 		show_list_timeline[ii]							// it is for tip description
			
		});
	}
	
	
		
		
		
	var x = d3.scale.linear()
		.range([0, width]).nice();

	var y = d3.scale.linear()
		.range([height, 0]).nice();
		
	// setting column names for drawing circles
	var xPoint = "time",
		yPoint = "dataType";  
		
	draw_timeline(myDataNEW);

	// **********************************************
	function draw_timeline(data){
		
		data.forEach(function(d) {
			
			
			// **********************************************
			// setting Y axis values based on Diseases code
			//https://en.wikipedia.org/wiki/List_of_ICD-9_codes
			if ( d.dataType.charAt(0 ) !="0" && d.dataType.charAt(0 ) !="1" && d.dataType.charAt(0) !="2" && d.dataType.charAt(0) !="3"&& d.dataType.charAt(0) !="4"&& d.dataType.charAt(0) !="5"&& d.dataType.charAt(0) !="6"&& d.dataType.charAt(0) !="7"&& d.dataType.charAt(0) !="8"&& d.dataType.charAt(0) !="9")
			{
				d.dataType = 19;		// it means it starts with any type of character
				yaxis_value_flag[d.dataType] = 1;
			}
			else{
				// convert the string to integer and set some range
				d.dataType = + d.dataType;
				
				if( d.dataType>10000)
					d.dataType = d.dataType/100;	// Making 5 digit codes to 3 digit
				else 
					d.dataType = d.dataType/10;// Making 4 digit codes to 3 digit
				
				//console.log("before "+ d.dataType);
				
				if (d.dataType<1){
					d.dataType = d.dataType;	// seer data
					yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>=1 && d.dataType <=139 )
				{d.dataType = 1;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>139 && d.dataType <=239 )
				{	d.dataType = 2;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>239 && d.dataType <=279 )
				{	d.dataType = 3;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>279 && d.dataType <=289 )
				{	d.dataType = 4;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>289 && d.dataType <=319 )
				{	d.dataType = 5;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>319 && d.dataType <=359 )
				{	d.dataType = 6;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>359 && d.dataType <=389 )
				{	d.dataType = 7;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>389 && d.dataType <=459 )
				{	d.dataType = 8;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>459 && d.dataType <=519 )
				{	d.dataType = 9;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>519 && d.dataType <=579 )
				{	d.dataType = 10;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>579 && d.dataType <=629 )
				{	d.dataType = 11;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>629 && d.dataType <=679 )
				{	d.dataType = 12;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>679 && d.dataType <=709 )
				{	d.dataType = 13;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>709 && d.dataType <=739 )
				{	d.dataType = 14;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>739 && d.dataType <=759 )
				{	d.dataType = 15;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>759 && d.dataType <=779 )
				{	d.dataType = 16;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>779 && d.dataType <=799 )
				{	d.dataType = 17;
				yaxis_value_flag[d.dataType] = 1;
				}
				else if( d.dataType>799 && d.dataType <=999 )
				{	d.dataType = 18;
				yaxis_value_flag[d.dataType] = 1;
				}
				else
				{	d.dataType = 19;			
					yaxis_value_flag[d.dataType] = 1;
				}
				
			}		
			// **********************************************
			///console.log("after "+ d.dataType);
			
			
		  });
		  
		// **********************************************  
		// updating Y axis values
		var selected_yaxis = [];
		for ( var ii =0; ii<yaxis_value_flag.length ; ii++){
			if (yaxis_value_flag[ ii ] == 1){
				selected_yaxis.push( yaxis_value[ii] );
			}
		}
			
		// again calling data to update dataType based on new index of selected_yaxis
	    data.forEach(function(d) {
		  var old_value = 	yaxis_value[ d.dataType ];
		  var new_index = selected_yaxis.indexOf( old_value );
		  d.dataType = new_index;
	    });
		// **********************************************
		
		
		
		  // setting the max and min value of axis to show in Scatter graph
		var xMax = d3.max(data, function(d) { return d[xPoint]; }) ,	
		    xMin = d3.min(data, function(d) { return d[xPoint]; }) , 
			yMax = d3.max(data, function(d) { return d[yPoint]; }) * 1.05,
			yMin = d3.min(data, function(d) { return d[yPoint].valueOf() ; }) ;
		
		console.log("---------");
		console.log(xMax);
		console.log(xMin);
		x.domain([xMin-5  , xMax+5]);
		y.domain([yMin-0.8, yMax]);  // setting range to show 

		var xAxis = d3.svg.axis()
			  .scale(x)
			  .orient("bottom")
			  .tickSize(-height);

		var yAxis = d3.svg.axis()
			  .scale(y)
			  .orient("left")
			  .ticks( selected_yaxis.length )			// adding ticker at Y label
			  .tickFormat(function (d, i) {
					return selected_yaxis[d];
				})
			 .tickPadding(8)
			 .tickSize(-width);
			
		  
		  var tip = d3.tip()				//defining text format when you mouse over on points
			  .attr("class", "d3-tip")
			  .offset([-10, 0])
			  .html(function(d) {
		    	return d.show;  
				});

		  var zoomBeh = d3.behavior.zoom()
			  .x(x)
		   // .y(y)		// stooping zooming on Y axis
			  .scaleExtent([0, 500])
			  .on("zoom", zoom);			// calling zoom method

		  var svg = d3.select("#scatter_patient_timeline")
			.append("svg")
			  .attr("width", outerWidth)
			  .attr("height", outerHeight)
			.append("g")
			  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			  .call(zoomBeh);  // setting zoom structure

		  svg.call(tip);

		  svg.append("rect")
			  .attr("width", width)
			  .attr("height", height);

		  svg.append("g")
			  .classed("x axis", true)
			  .attr("transform", "translate(0," + height + ")")
			  .call(xAxis)		 					// setting the xAxis variable
			.append("text")
			  .classed("label", true)
			  .attr("x", width-180)
			  .attr("y", margin.bottom - 10)
			  .style("text-anchor", "middle")		// or you can use it in end
			  .text("Timeline");					// setting the title at the corner of graph axis
			  

		  svg.append("g")
			  .classed("y axis", true)
			  .call(yAxis)
			  //.style("font-size", "70%")		   // setting the size of Y axis text
			.append("text")
			  .classed("label", true)
			  .attr("transform", "rotate(-90)")
			  .attr("x", -100)
			  .attr("y", -margin.left+20)
			  .attr("dy", ".71em")
			  .style("text-anchor", "middle")
			  .text("Primary diagnosis type");

		  var objects = svg.append("svg")
			  .classed("objects", true)
			  .attr("width", width)
			  .attr("height", height);

		  objects.append("svg:line")
			  .classed("axisLine hAxisLine", true)
			  .attr("x1", 0)
			  .attr("y1", 0)
			  .attr("x2", width)
			  .attr("y2", 0);
			  
		  objects.append("svg:line")
			  .classed("axisLine vAxisLine", true)
			  .attr("x1", 0)
			  .attr("y1", 0)
			  .attr("x2", 0)
			  .attr("y2", height);
		
		
		  var node = objects.selectAll(".dot")
			  .data(data)		// loading data
			.enter().append("path")
			  .classed("dot", true)
			  .attr("d", d3.svg.symbol().type(function(d) { return "circle"; })
										.size( 
											function(d, i) { if (colorFlag[i]==0) return 100; else return 200; }) )  // Setting the symbol. 
																			// also set the size of symbol
			  .attr("transform", transform)

			  .style("fill", function(d, i) { 
								if (colorFlag[i]==0) return "green"; 
								if (colorFlag[i]==1) return "blue"; 
								
								})
                          .attr("stroke-width", 1)
                          .attr("stroke", "black")                                     
			  //.on("click", function(d) {
			  //	  alert("action");	  
			  //})
                          
			  .on("mouseover", tip.show)
			  .on("mouseout", tip.hide);
				
		  function zoom() {
			svg.select(".x.axis").call(xAxis);
			//svg.select(".y.axis").call(yAxis);

			svg.selectAll(".dot")
				.attr("transform", transform);
		  }

		  function transform(d) {
			return "translate(" + x(d[xPoint]) + "," + y(d[yPoint]) + ")";
		  }	
	} // end of function with data from dictionary
}
