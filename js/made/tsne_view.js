function initialize(myData){
	
		
	var margin = { top: 10, right: 0, bottom: 0, left: 20 },
		//TODO?: implement scalable svg margin?
		outerWidth = 560, //original value: 1000, 1200 also a good value
		outerHeight = 390, //original value: 550, 625 also a good value
		width = outerWidth - margin.left - margin.right,
		height = outerHeight - margin.top - margin.bottom;  // defining area for circles

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


	var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.tickSize(-height);
	
	var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.tickSize(-width);
	
	var radius = 8 * Math.sqrt(1/Math.PI);

   
	// RGB color checker: https://www.colorspire.com/rgb-color-wheel/
	
	
	
	/*
	//https://stackoverflow.com/questions/36993809/d3-assigning-a-color-to-a-specific-value
	var myCategory20Colors = [
	  0xee77b4, 0xaec7e8,  // I changed tis ee. pink 
	  0xff7f0e, 0xaabb78,  // I changed this aa  . shaded green
	  0xbba02c, 0x98df8a,  // I changed tis bb. shaded yellow 
	  0xd62728, 0xff9896,
		0x9467bd, 0xc5b0d5,
		0x8c564b,
	].map(function(x) {
		var value = x + "";
		return d3.rgb(value >> 16, value >> 8 & 0xff, value & 0xff).toString();
	});

	// Default colors:
	// var color = d3.scale.category20(); 			// Ashis: set the automatic color on each category
	var color = d3.scale.ordinal().range(myCategory20Colors);
	*/

	
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

	
	
	svg.append("rect")
				.attr("width", width)
				.attr("height", height);
				//.attr("stroke-width", 1)
				//.attr("stroke", "gray");  // giving a box area for the points/circles
							
							
    xMax = d3.max(myData, function(d) { return d.Xvalue; }) *1.03,
	xMin = d3.min(myData, function(d) { return d.Xvalue; }) *1.05,
	xMin = xMin > 0 ? 0 : xMin,
	yMax = d3.max(myData, function(d) { return d.Yvalue; }) *1.03,
	yMin = d3.min(myData, function(d) { return d.Yvalue; }) *1.05,
	yMin = yMin > 0 ? 0 : yMin;
	
	console.log(xMin);
	console.log(xMax);
	console.log(yMin);
	console.log(yMax);
		
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([-10, 0])
		.html(function(d) {
			    //sum_count += d["count"];
			    //alert(sum_count);
		            return "Code : " + d["code_name"]
				+ " PMI: " + d["pmi"]
				+ " Frequency: " + d["freq1"]
				+ "<br>" + "<br>"
				+ "Description: " + d.descript;
				//+ " <input type='button' value='select' />" ;

			});
    

    
    svg.call(tip);
        									
    var objects = svg.append("svg")
	.classed("objects", true)
	.attr("width", width)
	.attr("height", height);
    
    var node =objects.selectAll(".dot")
	.data(myData)					// loading data
	.enter().append("g");
    
	//console.log( color.domain() );  // this is same as legend_code_text
	
	// *******************   we are creating this node. But, we actually using draw_orig() to see the node
    node.append("circle")
		.classed("dot", true)
		.attr("visibility", "visible")
		.attr("r", function(d) {
				return 1;
			    //return get_rad(d);
			})
		.attr("transform", transform)
		.style("fill", function(d) {
				return "#69b3a2";
			    //return color(d.type);
			})
		
		.on("mouseover", tip.show)
		.on("mouseout", tip.hide);
	// **********************************    

    
    objects.selectAll(".dot").each(function(d) {		// ********************* setting center points of each dot
    	d3.select(this).attr("cx", x(d.Xvalue));
    	d3.select(this).attr("cy", y(d.Yvalue));
    });


    //console.log( color.domain() );
    var legend = svg.selectAll(".legend")
	.data( legend_code_text )
	.enter().append("g")
	.classed("legend", true)
	.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    
	// ***************************************** Circle Icon
    // ************************************************************
    var filter_array_fading = [];
    
    legend.append("circle")
	.attr("r", 7)
	.attr("cx", (-1)* margin.left +10)
	.attr("id", function(d, i) {
		    //Ashis: Set ID by ourself. Just added prefix c_  without any meaning (No, it has meaning. c_ is used for circle legend. only text is used for legend text)
		    
			return "c_"+legend_code_text[i];
		})
		.attr("fill", function(d, i) {
			//Ashis: now here again removing prefix c_
			return myColor[i];
		   // return color(d3.select(this).attr("id").substring(2, d3.select(this).attr("id").length + 1));
		})
		.attr("stroke-width", function(d){ return 0.5;})
        .attr("stroke", "black")
			
		.on("click", function(d) {
			
		    var len = d3.select(this).attr("id").length;
		    var id  = d3.select(this).attr("id");
		    var sub = id.substring(2, len + 1);
		   
		    // Ashis: we want to change the Legend text. So, we need to use its id
		    // Circle ID starts with c_ prefix
		    // Legend text ID is only text

		    // sub: deleted part of c_
		    var legend_text_selected = document.getElementById(sub);
		    

		    if(search_filt(sub, filter_array_fading)) {
				//make text unbold
				legend_text_selected.style.fontStyle = "normal";
				anti_filter(sub, filter_array_fading);
				filter_array_fading.splice(filter_array_fading.indexOf(sub), 1);
				if(filter_array_fading.length === 0) {
				    objects.selectAll(".dot").style("fill-opacity", 0.9);
				    objects.selectAll("text").style("visibility", "visible");
				}else{
				    for(var filt_ctr = 0; filt_ctr < filter_array_fading.length; filt_ctr++) { 
					filter(filter_array_fading[filt_ctr], filter_array_fading);
				    }
				}
		    }
		    else{
		    	

				legend_text_selected.style.fontStyle = "italic";
				filter_array_fading.push(sub);
				//alert(legend_text_selected);
				for(var filt_ctr = 0; filt_ctr < filter_array_fading.length; filt_ctr++) { 
				    filter(filter_array_fading[filt_ctr], filter_array_fading);
				}
		    }
	});
    
    // ***************************************** Adding legend text
    // ************************************************************

    legend.append("text")
	    //constant controls proximity to dot in the legend
		.attr("x",  (-1)* margin.left + 20 )  // defining the legend outside of "width"
		//.attr("y", function(d, i) { return legend_sort(d, i); })
		.attr("dy", ".35em")
		.text(function(d, i) {
			
			return legend_circle_code_text[i]+":"+legend_code_text[i];
			})
		.attr("id", function(d, i) {
		    //Ashis: Set ID useing text
		    return legend_code_text[i];
		});

    

	// Ashis: Adding another legend at the below of first one to show circle size
	// **************************************************************************
    legend.append("text")
    	.attr("x", (-1)* margin.left +40)
    	.attr("y", function(d, i) { return (i+280)} )
    	.text( function(d, i) {
		   
		    	switch(i) {
					case 0:  return "Circle Size:" ;
					case 1:  return "Small (<100 patients)" ;
					case 2:  return "Medium (100-1K)";
					case 3:  return "Large (1K-5K)";
					case 4:  return "Very large (>5K)";
					
					}
			});
	
		
    legend.append("circle")
	.attr("r", function(d, i) {
		   
		    	switch(i) {
					case 0:  return 0 ;
					case 1:  return 10 ;
					case 2:  return 13;
					case 3:  return 16;
					case 4:  return 19;
					
					}
			})
	.attr("cx", (-1)* margin.left + 20 )
	.attr("cy", function(d, i) { return (i+ 280)} )
	.attr("fill", "black");
	

   

	function get_ppmi_scale(obj) {
	 if (obj.pmi < 1)
		return 1;
	 else
		return 0;
	}


	function get_rad(obj) {
	/**
	 * Checks obj's count field and
	 * returns a specific radius as appropriate.
	 * Categories that are more popular will have
	 * larger radii.
	 * The constants are arbitrary.
	 * This is written for center_v3.csv
	 */
	var ct = obj.freq1;
	if( ct< 100) return 8;	//Ashis: our points actually started from here
	if(100 <= ct && ct < 1000) return 11;
	if(1000 <= ct && ct < 5000) return 14;
	if(5000 <= ct ) return 18;
	}
    
	function filter(category, filter_array_fading){
	/**  
	 * This function should allow the user to filter the graph based on what
	 * They click in the legend.
	 * e.g. If the user clicks "neoplasms" then the dots corresponding
	 * to neoplasms will be more apparent than other dots. text will show.
	 * allows multiple filtering
	 */
	objects.selectAll("text").each(function(d) {
		if(!d3.select(this).classed("clstr")) {
			if(search_filt(d.type, filter_array_fading)) {
				d3.select(this).style("visibility", "visible");
			}else{
				d3.select(this).style("visibility", "hidden");
			}
		}
	});

	node.selectAll(".dot").style("fill-opacity", function(d) {
		//if dot type is in the array of filter, show it
		if(search_filt(d.type, filter_array_fading )) {
			return 0.9;
			//else make it less apparent
		}else{
			return 0.15;
		}
	});
	}

	function anti_filter(category, filter_array_fading) {
	/**
	 * This function reverts the filtering done by filter.
	 */
		node.selectAll(".dot").style("fill-opacity", function(d) {
			//alert(d["type"]);
			if(d["type"] != category && !search_filt(d["type"], filter_array_fading)) {
			return 0.9;
			}
		});
		
		objects.selectAll("text").each(function(d) {
			if(d3.select(this).classed("clstr") == false) {
			d3.select(this).attr("visibility", function(d) {
				if(search_filt(d.type, filter_array_fading )) {
				return "visible";
				}else{
				return "hidden";
				}
			});
			}
		});

		node.selectAll(".dot").style("fill-opacity", function(d) {
			//if dot type is in the array of filter, show it
			if(search_filt(d["type"], filter_array_fading)) {
			return 0.9;
			//else make it less apparent
			}else{
			return 0.15;
			}
		});


	}
    
	//standard bool search
	function search_filt(thing, filter_array_fading) {
		for(var i = 0; i < filter_array_fading.length; i++) {
			if(filter_array_fading[i] == thing) {
			return true;
			}
		}
		return false;
	} 
    

	function draw_orig() {
		//this prevents overlap and extra text elements
		node.selectAll("text").remove();
		
			
			// marking given code in bold border
		var givenCode = document.getElementById("codevalue").value;
		var n = givenCode.indexOf("-");          // Deleting code description from Textfield
		if (n>0)
			givenCode = givenCode.slice(0, n);
		givenCode = givenCode.substring(2);     // cutting first two digits, i.e. "d_"
			
		//redraw the text
		node.append("text")
			.attr("transform", transform1)
			.text(function(d) {
			
			return d.code_name; 
			})
				.style("font-size", "8px")
				.style("font-weight", "bold")
				// the bold format didn't work
				//function (d) { console.log("radius "+get_rad(d)); if (get_rad(d)>14) return "bold"; else return "normal";} 
				
				.style("text-decoration", function (d) { if (get_ppmi_scale(d)==1) return "underline"; else return "solid";} )
				.attr("text-anchor", "middle");
		
		//redraw the dots
		node.selectAll(".dot").remove();
		node.append("circle")
			.classed("dot", true)
			.attr("visibility", "visible")
			.attr("r", function (d) { return get_rad(d); })
			.attr("transform", transform)
			.style("fill", function(d) {
				return myColor[ legend_code_text.indexOf( d.type ) ];
				//return color(d.type);
			})
					.attr("stroke-width", function(d){ if (givenCode == d.code_name) return 3; else return 0.5;})
					.attr("stroke", "black")
					  
			.on("click", function(d){ 
					console.log( " I clicked ");  // It works
					$("#table_panel").tabulator("updateData", [{id: d.id , status_flag:"Explore"}] );

					//alert("ash");  // creating circle click funtion. 
					// However, there was a problem to redraw the circle. Hence, I decided to draw from table click
					// Problem is : mouse hover tip text exists when you click on a circle. Because you are not calling mouseout
					
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


		for(var filt_ctr = 0; filt_ctr < filter_array_fading.length; filt_ctr++) { 
			filter(filter_array_fading[filt_ctr]);
		}
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
		return 	Number((x(d.Xvalue)))     + "," + Number(y(d.Yvalue))       + " " +
				Number((x(d.Xvalue) - 6)) + "," + Number((y(d.Yvalue) + 6)) + " " +
				Number((x(d.Xvalue) + 6)) + "," + Number((y(d.Yvalue) + 6));
	}

	function transform_clst(d) {
		var x_offset = 4,
			y_offset = 14;
		return "translate(" + (x(d.centerX) - x_offset) + "," + (y(d.centerY) - y_offset) + ")";
	}

	draw_orig();
}
