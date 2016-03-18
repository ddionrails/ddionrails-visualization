function density(options){
    
    d3.selectAll('.chart').remove();
    
    
   var rawData = {
        "study":"soep-test",
        "dataset":"test1",
        "variable":"age",
        "label":"Alter",
        "scale":"num",
        "uni":{
            "density":[12,123,321,214,100],
            "weighted":[14,121,221,314,100],
            "min":20,
            "max":100,
            "by":20,
            "missings":{
                "frequencies":[100,200],
                "weighted":[110,190],
                "labels":["trifft nicht zu", "keine Antwort"],
                "values":[-2,-1]
            }
        },
        "bi":{
            "sex":{
                "label":"Geschlecht",
                "categories":{
                    "0":{
                        "label":"Mann",
                        "density":[7,123,321,214,100],
                        "weighted":[9,121,221,314,100],
                        "missings":{
                            "frequencies":[50,50],
                            "weighted":[55,45],
                            "labels":["trifft nicht zu", "keine Antwort"],
                            "values":[-2,-1]
                        }
                    },
                    "1":{
                        "label":"Frau",
                        "density":[12,123,321,214,100],
                        "weighted":[12,73,221,314,150],
                        "missings":{
                            "frequencies":[50,150],
                            "weighted":[55,145],
                            "labels":["trifft nicht zu", "keine Antwort"],
                            "values":[-2,-1]
                        }
                    }
                },
                "min":20,
                "max":100,
                "by":20
            }
        }
    }
	
	
		if(options.weights == true){
			dataType = 'weighted'
		}
		else{
			dataType = 'density'
		}
        
        var data = [];
        var range = d3.range(rawData.uni.min, rawData.uni.max + 1, rawData.uni.by);
        range.map(function(d, i){
           
            tmp = [range[i], rawData.uni[dataType][i]];
            data.push(tmp);
            
        })
        
       


		var margin = {top: 30, right: 10, bottom: 40, left: 100};
		
		var w =600 - margin.left - margin.right;
		var h = 300 - margin.top - margin.bottom;
	
		
		
		var svg = d3.select('#chart')
						.append('svg')
						.attr('width', w + margin.left + margin.right)
						.attr('height', h + margin.top + margin.bottom)
						.attr('class', 'chart')
                        .append('g')
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
		
		/**
		var rawData = d3.json('./testdata/age.json', function(error, json) {
			if (error) return console.warn(error);
				rawData = json; **/
	
        
     
		var xScale = 	d3.scale.ordinal()
						.domain(range)
						.rangeRoundBands([0, w], 0, 0.5);
						
		var yScale = d3.scale.linear()
						.domain([0, d3.max(rawData.uni[dataType])])
						.range([h, 0]);
		
		
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom');

		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left');	
	
		var yAxisLabel = svg.append('text')
							.attr('transform', 'translate(' + (65 - margin.left) + ',' + h/2 + ')rotate(-90)')
							.attr('class', 'labels')
							.attr('text-anchor', 'middle')
							.text(rawData.label);
        
        var yAxisLabel2 = svg.append('text')
							.attr('transform', 'translate(' + (65 - margin.left) + ',' + (-margin.top/2) + ')')
							.attr('class', 'labels')
							.attr('text-anchor', 'middle')
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
					 .interpolate('cardinal');
					 
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
                        sum =  d3.sum(data.map(function(d){return d[1] }));
                        format = d3.format('0.1%');
                        return format(d[1] / sum) 					
                    }
                    else {
                       return d[1]	
                    }    
                });
                
        
		
         
                
       /*****************************************************/ 
       
       if(options.weights == true){
			dataType_missings = 'weighted'
		}
		else{
			dataType_missings = 'frequencies'
		}
        

        data = [];
        for(i = 0;  i < rawData.uni.missings[dataType_missings].length; i++){
            
            tmp = [rawData.uni.missings.labels[i], rawData.uni.missings[dataType_missings][i]];
            data.push(tmp);	
        }

		
        var colors = ["#d9d9d9", "#737373"];
		var w =600 - margin.left - margin.right;
		var h = (80 + 10 * data.length) - margin.top - margin.bottom;
		
		var svg2 = d3.select('#chart_missings')
						.append('svg')
						.attr('width', w + margin.left + margin.right)
						.attr('height', h + margin.top + margin.bottom)
						.attr('class', 'chart')
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
						.range([0, w]);
						
		// Y-Skala
		var yScale = d3.scale.ordinal()
			.domain(data.map(function(d){return d[0]}))
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
			 .attr('y', function(d) {return yScale(d[0])})
			 .attr('width', function(d){ return xScale(d[1])}) 
			 .attr('height', (h / data.length) - 1);		


		barHeight = (h / data.length) - 1;
		text.attr('x', function(d) { return xScale(d[1])-3})
			.attr('y', function(d) {return yScale(d[0]) + (barHeight/2)+3});
            
        var yAxisLabel3 = svg2.append('text')
							.attr('transform', 'translate(' + (65 - margin.left) + ',' + (-margin.top/2) + ')')
							.attr('class', 'labels')
							.attr('text-anchor', 'middle')
							.text("Invalid cases");
            
     
}