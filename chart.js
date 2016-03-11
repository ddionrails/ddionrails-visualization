var stacked;
var hideMissings;	
var colors;

function organizeData(options, menu_c_active){
	
		var rawData = { 
		  
				"study":"soep-test",
				"dataset":"test1",
				"variable":"edu",
				"label":"Hoechster Bildungsabschluss",
				"uni":{
					"frequencies":[20, 12,123,321,214,100],
					"values":[-2,-1,1,2,3,4],
					"missings":[true, true,false,false,false,false],
					"labels":["-8", "no response","Hauptschule","Realschule","Gymnasium","University"],
				},
				"bi":{
					"sex":{
						"label":"Geschlecht",
						"categories":{
							"0":{
								"label":"Mann",
								"frequencies":[4, 1, 2, 3, 4, 5],
								"weighted":	  [9, 90, 3, 4, 5, 6],
							},
							"1":{
								"label":"Frau",
								"frequencies":[4, 2, 3, 6, 8, 10],
								"weighted":	  [9, 90, 3, 4, 5, 6],
							}
						},
						"values":[-2,-1,1,2,3,4],
						"missings":[true, true,false,false,false,false],
						"labels":["-8", "no response","Hauptschule","Realschule","Gymnasium","University"],
					},
					"wave":{
						"label":"Welle",
						"categories":{
							"0":{
								"label":"94",
								"frequencies":[7, 99, 4, 4, 5, 8],
								"weighted":	  [9, 90, 3, 4, 5, 6],
							},
							"1":{
								"label":"95",
								"frequencies":[4, 2, 3, 6, 8, 10],
								"weighted":	  [9, 90, 3, 4, 5, 6],
							},
							"2":{
								"label":"96",
								"frequencies":[8, 90, 30, 65, 83, 10],
								"weighted":	  [9, 90, 3, 4, 5, 6],
							},
							"3":{
								"label":"97",
								"frequencies":[55, 4, 3, 6, 5, 10],
								"weighted":	  [9, 90, 3, 4, 5, 6],
							}
						},
						"values":[-2,-1,1,2,3,4],
						"missings":[true, true,false,false,false,false],
						"labels":["-8", "no response","Hauptschule","Realschule","Gymnasium","University"],
					}
				}
			}
			
	colors = d3.scale.category20();
		colors.domain(rawData.bi[menu_c_active].labels)
     
	if(options.missings == true){
		hideMissings = true
	}
	else{
		hideMissings = false
	}
	
	if(options.percent == true){
		offset = "expand";
	}
	else{
		offset = "";
	}
	if(options.weights == true){
		dataType = "weighted"
	}
	else{
		dataType = "frequencies"
	}
		
	var data  = [];
	var indices = []
	for(i = 0; i < rawData.bi[menu_c_active].missings.length; i++){
		if(rawData.bi[menu_c_active].missings[i] == true){
			indices.unshift(i);
		}
	}
				
	for(i in rawData.bi[menu_c_active].categories){
		id = rawData.bi[menu_c_active].categories[i].label;
				
		// Gewichtet oder nicht
		freqs = rawData.bi[menu_c_active].categories[i][dataType];
			
		// Missings oder nicht
		if(hideMissings == true){
			for(i in indices){
				freqs.splice(indices[i], 1);
			}
		}
				
		freqs.unshift(id);
		data.push(freqs);
				
	}
		
	labels = rawData.bi[menu_c_active].labels;
			if(hideMissings == true){
				for(i in indices){
					labels.splice(indices[i], 1);
				}
			};
			
            var mapped =labels.map(function(dat,i){
                return data.map(function(d){
                    return {x: d[0], y: d[i+1], label: dat};
                })
            });
			
			// normalized or not
			stacked = d3.layout.stack().offset(offset)(mapped);
	}	

function drawChart(){
	
	d3.selectAll(".chart").remove();
	
	var tip = d3.select("body").append("tip")	
						.attr("class", "tooltip")				
						.style("opacity", 0);

			var w =600;
			var h = 300;
			padding = 100;
			barPadding = 0.2;
			barOutPadding = 0.1;
								
			var svg = d3.select("#chart")
						.append("svg")
						.attr("width", w)
						.attr("height", h)
						.attr("class", "chart");
			

		var xScale = d3.scale.ordinal()
						.domain(stacked[0].map(function(d) { return d.x; }))
						.rangeRoundBands([0, w - padding], barPadding, barOutPadding);
					
		var yScale = d3.scale.linear()
						.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y})])
						.range([h - padding, 0]);

		var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom")

						
	
		var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient("left");						
		
		svg.append("g")
			.call(xAxis)
			.attr("class", "axis")
			.attr("transform", "translate(" + padding + "," + (h-padding)+")");			
	
		svg.append("g")
			.call(yAxis)
			.attr("class", "axis")
			.attr("transform", "translate(" + padding + ",0)");		
		

         var layer = svg.selectAll("layer")
            .data(stacked)
            .enter()
			.append("g")
            .attr("class", "layer")
            .style("fill", function(d){
				for(i in d){
					return colors(d[i].label)
				}
			})
			.attr("transform", "translate(" + padding + ",0)");			

           
        var rect = layer.selectAll("rect")
            .data(function(d){return d})
            .enter()
			.append("rect")
            .attr("x", function(d) {return xScale(d.x)})
            .attr("y", function(d) {return yScale(d.y + d.y0)})
            .attr("height", function(d) {return yScale(d.y0) - yScale(d.y + d.y0)})
            .attr("width", xScale.rangeBand())
			.attr("class", "rect")
			.on("mouseover", function(d) {		
				tip.transition()			
					.style("opacity", .9);		
				tip.html("<strong>" +d.label + "</strong>: " + d3.format(".2f")(d.y))	
					.style("left", (d3.event.pageX) + "px")		
					.style("top", (d3.event.pageY) + "px");	
            })					
			.on("mouseout", function(d) {		
				tip.transition()			
					.style("opacity", 0);	
			});
		
}	


