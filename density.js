function density(options){
    
    d3.selectAll('.chart').remove();
	d3.select('.chart_missings').remove();
    
    
		var rData = JSON.parse(JSON.stringify(rawData))

		if(options.weights == true){
			dataType = 'weighted'
		}
		else{
			dataType = 'density'
		}
		
		if(options.weights == true){
			dataType_missings = 'weighted'
		}
		else{
			dataType_missings = 'frequencies'
		}
		
		
        
        var data = [];
        var range = d3.range(rData.uni.min, rData.uni.max + 1, rData.uni.by);
        range.map(function(d, i){
           
            tmp = [range[i], rData.uni[dataType][i]];
            data.push(tmp);
            
        })
        
       


		var margin = {top: 20, right: 40, bottom: 40, left: 100};
		
		var w =600 - margin.left - margin.right;
		var h = 300 - margin.top - margin.bottom;
	
		
		
		var svg = d3.select('#chart')
						.append('svg')
						.attr('width', w + margin.left + margin.right)
						.attr('height', h + margin.top + margin.bottom)
						.attr('class', 'chart')
                        .append('g')
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	

		var xScale = 	d3.scale.ordinal()
						.domain(range)
						.rangeRoundBands([0, w], 0, 0.5);
						
		var yScale = d3.scale.linear()
						.domain([0, d3.max(rData.uni[dataType])])
						.range([h, 0]);
		
		
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom');
		
		
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left');
		
	
		var gAxis = svg.append("g")
			.attr('class', 'axis')
			.call(yAxis);
			
	
		var maxLabelWidth = 0;
		gAxis.selectAll("text").each(function () {
			var width = this.getBBox().width;
			if (width > maxLabelWidth){
				maxLabelWidth = width;
			} 
		});
		
	
		var yAxisLabel = svg.append('text')
							.attr('transform', 'translate(' + (-maxLabelWidth-15) + ',' + h/2 + ')rotate(-90)')
							.attr('class', 'labels')
							.attr('text-anchor', 'middle')
							.text(rData.label);
        
        var yAxisLabel2 = svg.append('text')
							.attr('transform', 'translate(0' + ',' + (-margin.top/2) + ')')
							.attr('class', 'labels')
							.attr('text-anchor', 'end')
							.text("Valid cases");
		
		svg.append('g')
			.call(xAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + h + ')')			
	
		svg.append('g')
			.call(yAxis)
			.attr('class', 'axis');
		
		var path = d3.svg.line()
					 .x(function(d) {return xScale(d[0])})
					 .y(function (d) {return yScale(d[1])})
					 .interpolate('monotone');
					 
		svg.append('path')
			.attr('class', 'line')
			.attr('d', path(data));	
		
		
		var points = svg.append('g');
		
		points.selectAll('circle')
					.data(data)
					.enter()
					.append('circle')
					.attr('cx', function(d) { return xScale(d[0]); })
					.attr('cy', function(d) { return yScale(d[1]); })
					.attr('r', 3)
					.style('fill', 'steelblue');

					
		var labels = svg.append('g')
						.attr('class', 'labels');

		labels.selectAll('text')
				.data(data)
				.enter()
				.append('text')
				.attr('x', function(d) { return xScale(d[0]); })
				.attr('y', function(d) { return yScale(d[1]); })
				.attr('dy', -10)
				.attr('text-anchor', 'middle')
                .text(function(d){
                    
                    if(options.percent == true){
                        sum =  d3.sum(data.map(function(d){return d[1] })) + d3.sum(rData.uni.missings[dataType_missings]);
                        format = d3.format('0.1%');
                        return format(d[1] / sum) 					
                    }
                    else {
                       return d[1]	
                    }    
                });
                
        
		
         
                
       /*****************************************************/ 
       
       if(options.missings == false){
		
        var rData = rawData;

        data = [];
        for(i = 0;  i < rData.uni.missings[dataType_missings].length; i++){
            
            tmp = [rData.uni.missings.values[i], rData.uni.missings.labels[i], rData.uni.missings[dataType_missings][i]];
            data.push(tmp);	
        }

		
        var colors = ["#d9d9d9", "#737373"];
		var w = 600 - margin.left - margin.right;
		var h = (80 + 10 * data.length) - margin.top - margin.bottom;
		
		var svg2 = d3.select('#chart_missings')
						.append('svg')
						.attr('width', w + margin.left + margin.right)
						.attr('height', h + margin.top + margin.bottom)
						.attr('class', 'chart_missings')
                        .append('g')
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
						
       rects = svg2.selectAll('rect')
					.data(data)
					.enter()
					.append('rect')
                    .style('fill', function(d, i){ return colors[i]; })
					.attr('class', 'rects');
			
		text = svg2.selectAll('text')
					.data(data)
					.enter()
					.append('text')
					.attr('class', 'text');
	

		if(options.percent == true){
			format = d3.format('0.1%');
			text.text(function(d) {return format(d[2] / sum)}) 					
		}
		else{
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
			.domain(data.map(function(d){return ("[" + d[0] + "] " + d[1]) }))
			.rangeRoundBands([h, 0]);
				
					
		// X-Achse
		var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient('bottom');
						
		// Y-Achse
		var yAxis = d3.svg.axis()
						.scale(yScale)
						.orient('left');				
		
		svg2.append('g')
			.call(xAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + h + ')');			
			
		svg2.append('g')
			.call(yAxis)
			.attr('class', 'axis');			
		
		
		rects.attr('x', 0) 
			 .attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1])})
			 .attr('width', function(d){ return xScale(d[2])}) 
			 .attr('height', (h / data.length) - 1);		


		barHeight = (h / data.length) - 1;
		text.attr('x', function(d) { return xScale(d[2])+ 3})
			.attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1]) + (barHeight/2)+2});
            
        var yAxisLabel3 = svg2.append('text')
							.attr('transform', 'translate(0' + ',' + (-margin.top/2) + ')')
							.attr('class', 'labels')
							.attr('text-anchor', 'end')
							.text("Invalid cases");
	   }   
	   if(options.missings == true){
		   d3.select('.chart_missings').remove();
	   }
}
