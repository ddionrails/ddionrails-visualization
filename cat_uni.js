var cat_uni = function cat_uni(){
	
			d3.selectAll(".chart").remove();
			
			//var rawData = d3.json("./testdata/edu.json");

			var rawData = { 
		  
				"study":"soep-test",
				"dataset":"test1",
				"variable":"edu",
				"label":"Hoechster Bildungsabschluss",
				"uni":{
					"frequencies":[12,123,321,214,100],
					"values":[-1,1,2,3,4],
					"missings":[true,false,false,false,false],
					"labels":["no response","Hauptschule","Realschule","Gymnasium","University"],
				},
				"bi":{
					"sex":{
						"label":"Geschlecht",
						"categories":{
							"0":{
								"label":"Mann",
								"frequencies":[7,123,321,214,100],
							},
							"1":{
								"label":"Frau",
								"frequencies":[12,123,321,214,100],
							}
						},
						"values":[-1,1,2,3,4],
						"missings":[true,false,false,false,false],
						"labels":["no response","Hauptschule","Realschule","Gymnasium","University"],
					}
				}
			}
			

			
			
			
			data = [];
			for(i = 0;  i < rawData.uni.frequencies.length; i++){
				if(hideMissings == true && rawData.uni.missings[i]){
					continue;
				}
				
				tmp = [rawData.uni.labels[i], rawData.uni.frequencies[i]];
				data.push(tmp);	
			}
			
			

			var w =600;
			var h = 300;
			padding = 100;
			barPadding = 1;
			
			var svg = d3.select("#chart")
						.append("svg")
						.attr("width", w)
						.attr("height", h)
						.attr("class", "chart");
										
						
			rects = svg.selectAll("rect")
					.data(data)
					.enter()
					.append("rect")
					.attr("class", "rects");
			
			text = svg.selectAll("text")
					.data(data)
					.enter()
					.append("text")
					.attr("class", "text");
			
					

		var xScale = d3.scale.linear()
						.domain([0, d3.max(data, function(d) {
							return d3.max(d.filter(function(value) {
							return typeof value === "number";
							}));
						})])
						.range([0, w - padding]);
						
		// Y-Skala
		var yScale = d3.scale.ordinal()
						.domain(data.map(function(d){return d[0]}))
						.rangeRoundBands([h - padding, 0]);

						
							
		// X-Achse
		var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient("bottom");
						
		// Y-Achse
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
		
		
		rects.attr("x", 0) 
			 .attr("y", function(d) {return yScale(d[0])})
			 .attr("width", function(d){return xScale(d[1])}) 
			 .attr("height", ((h -padding) / data.length) - barPadding)
			 .attr("transform", "translate(" + padding + ",0)");			


		barHeight = ((h -padding) / data.length) - barPadding;
			
		text.attr("x", function(d) { return xScale(d[1])-3})
			.attr("y", function(d) {return yScale(d[0]) + (barHeight/2)} )
			.text(function(d) {return d[1]})
			.attr("transform", "translate(" + padding + ",0)");

}