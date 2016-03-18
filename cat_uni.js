 function cat_uni(options){

	d3.selectAll('.chart').remove();
			/**
            var rawData;
			d3.json('./testdata/edu.json', function(error, json) {
			if (error) return console.warn(error);
				rawData = json; 
	
            console.log(rawData.uni[dataType]) **/
        
			if(options.missings == true){
				hideMissings = true
			}
			else{
				hideMissings = false
			}
			
			if(options.weights == true){
				dataType = 'weighted'
			}
			else{
				dataType = 'frequencies'
			}
			
			colors = d3.scale.category20();
            colors.domain(rawData.uni.labels)
	

			data = [];
			for(i = 0;  i < rawData.uni[dataType].length; i++){
				if(hideMissings == true && rawData.uni.missings[i]){
					continue;
				}
				
				tmp = [rawData.uni.labels[i], rawData.uni[dataType][i]];
				data.push(tmp);	
			}


			var w =600;
			var h = 100 + 20 * data.length;
			padding = 100;
			barPadding = 1;
			
			var svg = d3.select('#chart')
						.append('svg')
						.attr('width', w)
						.attr('height', h)
						.attr('class', 'chart');
										
						
			rects = svg.selectAll('rect')
					.data(data)
					.enter()
					.append('rect')
                    .style('fill', function(d){ return colors(d[0]); })
					.attr('class', 'rects');
			
			text = svg.selectAll('text')
					.data(data)
					.enter()
					.append('text')
					.attr('class', 'text');
	

		if(options.percent == true){
			var sum =  d3.sum(data.map(function(d){return d[1] }));
			format = d3.format('0.1%');
			text.text(function(d) {return format(d[1] / sum)}) 					
		}
		else{
			text.text(function(d) {return (d[1])})	
		}			

		var xScale = d3.scale.linear()
						.domain([0, d3.max(data, function(d) {
							return d3.max(d.filter(function(value) {
							return typeof value === 'number';
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
						.orient('bottom');
						
		// Y-Achse
		var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient('left');				
		
		svg.append('g')
			.call(xAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(' + padding + ',' + (h-padding)+')');			
			
		svg.append('g')
			.call(yAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(' + padding + ',0)');			
		
		
		rects.attr('x', 0) 
			 .attr('y', function(d) {return yScale(d[0])})
			 .attr('width', function(d){return xScale(d[1])}) 
			 .attr('height', ((h -padding) / data.length) - barPadding)
			 .attr('transform', 'translate(' + padding + ',0)');			


		barHeight = ((h -padding) / data.length) - barPadding;
		text.attr('x', function(d) { return xScale(d[1])-3})
			.attr('y', function(d) {return yScale(d[0]) + (barHeight/2)} )
			.attr('transform', 'translate(' + padding + ',0)');
            
        }
//}