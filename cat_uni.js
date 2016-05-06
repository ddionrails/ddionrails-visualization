 function cat_uni(options){

	d3.selectAll('.chart').remove();
		
			var rData = rawData; 
				
        
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
			
			/**
			colors = d3.scale.ordinal()
				.domain(rData.uni.labels)
				.range(colors_blue);
			**/
			
			colors = d3.scale.category20();
            colors.domain(rData.uni.labels)

			data = [];
			for(i = 0;  i < rData.uni[dataType].length; i++){
				if(hideMissings == true && rData.uni.missings[i]){
					continue;
				}
				
				tmp = [rData.uni.values[i], rData.uni.labels[i], rData.uni[dataType][i]];
				data.push(tmp);	
			}

			var margin = {top: 20, right: 40, bottom: 40, left: 100};
		
			var w = 600 - margin.left - margin.right;
			var h = (100 + 20 * data.length) - margin.top - margin.bottom;
			
			padding = 100;
			barPadding = 1;
			
			var svg = d3.select('#chart')
						.append('svg')
						.attr('width', w + margin.left + margin.right)
						.attr('height', h + margin.top + margin.bottom )
						.attr('class', 'chart')
						.append('g')
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
			
			
			rects = svg.selectAll('rect')
					.data(data)
					.enter()
					.append('rect')
                    .style('fill', function(d){ return colors(d[1]); })
					.attr('class', 'rects');

			
			
			text = svg.selectAll('text')
					.data(data)
					.enter()
					.append('text')
					.attr('class', 'text');
	
			if(options.percent == true){
				var sum =  d3.sum(data.map(function(d){return d[2] }));
				format = d3.format('0.1%');
				text.text(function(d) {return format(d[2] / sum)}) 					
			}
			else {
				text.text(function(d) {return (d[2])})	
			}			
			

		var xScale = d3.scale.linear()
						.domain([0, d3.max(data, function(d) {
							return d3.max(d.filter(function(value) {
							return typeof value === 'number';
							}));
						})])
						.range([0, w]);
						
		// Y-Skala
		var yScale = d3.scale.ordinal()
						.domain(data.map(function(d){return ("[" + d[0] + "] " + d[1])}))
						.rangeRoundBands([h, 0]);
					

						
							
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
			.attr('transform', 'translate(0,' + h + ')');			
			
		svg.append('g')
			.call(yAxis)
			.attr('class', 'axis');		
		
		
		rects.attr('x', 0) 
			 .attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1])})
			 .attr('width', function(d){return xScale(d[2])}) 
			 .attr('height', (h / data.length) - barPadding);			

		barHeight = (h / data.length) - barPadding;
        
	     
		text.attr('x', function(d) {return xScale(d[2]) + 3})
			.attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1]) + (barHeight/2) + 2});
			
		

		
        }
        

