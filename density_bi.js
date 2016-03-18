function density_bi(options){
    
        d3.selectAll('.chart').remove();

        var data  = [];
		var labels = [];
  
        
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
        
				
	for(i in rawData.bi[menu2_active].categories){
		id = rawData.bi[menu2_active].categories[i].label;
				
		// Gewichtet oder nicht
		freqs = rawData.bi[menu2_active].categories[i][dataType];
			
		// Missings oder nicht
		//freqs.unshift(id);
		data.push(freqs);
		labels.push(id);
				
	}
	
		var range = d3.range(rawData.uni.min, rawData.uni.max + 1, rawData.uni.by);
		var margin = {top: 30, right: 0, bottom: 30, left: 100};
		
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
						.domain(labels)
						.rangeRoundBands([0, w], 0, 0);
						
		var yScale = d3.scale.ordinal()
						.domain(range)
						.rangeRoundBands([h, 0], 0, 0.5);
		
		
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom');
            
		var yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left');	
	
		var yAxisLabel = svg.append('text')
							.attr('transform', 'translate(' + (65 - margin.left) + ',' + (h/2) + ')rotate(-90)')
							.attr('class', 'labels')
							.attr('text-anchor', 'start')
							.text(rawData.label);
                            
        var yAxisLabel2 = svg.append('text')
							.attr('transform', 'translate(' + (65 - margin.left) + ',' + (-margin.top/2) + ')')
							.attr('class', 'labels')
							.attr('text-anchor', 'middle')
							.text("Valid cases");                    
		
		svg.append('g')
			.call(xAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + h + ')');				
	
		svg.append('g')
			.call(yAxis)
			.attr('class', 'axis');
	
        
		for(i = 0; i < data.length; i++){
		
		var xScale2 = d3.scale.ordinal()
						.domain(d3.range(rawData.uni.min, rawData.uni.max + 1, rawData.uni.by))
						.rangeRoundBands([0, h], 0, 0.5);
						
						
		var yScale2 = d3.scale.linear()
						.domain([0, d3.max(data, function(d) { return d3.max(d); })])
						.range([(xScale.rangeBand()* (i) + (xScale.rangeBand()/2)), ((xScale.rangeBand()* (i+1))-5)]);
	
		var path = d3.svg.area()
					 .x(function(d, i) { return xScale2(range[i])})
					 .y(function (d) {return yScale2(d)})
                     .y0(function (d) {return yScale2(-d)})
					 .interpolate('cardinal');
					 
                     
				 
		svg.append('path')
			.attr('class', 'line')
			.attr('d', path(data[i]))
            .attr("transform", "rotate(-90)")
			.style("fill", "steelblue")
            .attr('transform', 'translate(0,' + h + ') rotate(-90)')

		
		}	
		

	/*****************************************************************/

   var tip = d3.select('body').append('tip')	
						.attr('class', 'tooltip')				
						.style('opacity', 0);
                        
	if(options.percent == true){
		offset = 'expand';
		format = d3.format('%');
	}
	else{
		offset = '';
		format = d3.format('s');
	}
	if(options.weights == true){
		dataType_missings = 'weighted'
	}
	else{
		dataType_missings = 'frequencies'
	}

    	
	
	var data  = [];	
	for(i in rawData.bi[menu2_active].categories){
		id = rawData.bi[menu2_active].categories[i].label;
		
		// Gewichtet oder nicht
		freqs = rawData.bi[menu2_active].categories[i].missings[dataType_missings];
        			
		freqs.unshift(id);
		data.push(freqs);
			
	}


    // Check if missings of categories are identical
    
    function checkLabels(){
        
        for(i = 0; i < rawData.bi[menu2_active].categories[i].missings[dataType_missings].length; i++){
        
        labels_i = rawData.bi[menu2_active].categories[i].missings.labels;
        labels_ii =  rawData.bi[menu2_active].categories[++i].missings.labels;
        
        if(labels_i.length !== labels_i.length){
            return false;
        }
        for(var i = labels_i.length; i--;) {
            if(labels_i[i] !== labels_ii[i])
            return false;
        }
    return true;
    }   
}

    var labels_identical = checkLabels();
    var labels; 
    
    if(labels_identical){
        labels = rawData.bi[menu2_active].categories[0].missings.labels;
    }
    else{
        console.log("Error. Unhandled Problem with missing labels (not identical).")
    }
			
            var mapped = labels.map(function(dat,i){
                return data.map(function(d){
                    return {x: d[0], y: d[i+1], label: dat};
                })
            });
			
			// normalized or not
			var stacked = d3.layout.stack().offset(offset)(mapped);
        
        
        var barPadding = 0.2;
		var barOutPadding = 0.1;     
           
        var colors = ["#d9d9d9", "#737373"];
     
		var w2 = 600 - margin.left - margin.right;
		var h2 = 100 - margin.top - margin.bottom;
		
		var svg2 = d3.select('#chart_missings')
						.append('svg')
						.attr('width', w2 + margin.left + margin.right)
						.attr('height', h2 + margin.top + margin.bottom)
						.attr('class', 'chart')
                        .append('g')
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
       
                     
        var xScale = d3.scale.ordinal()
						.domain(stacked[0].map(function(d) { return d.x; }))
						.rangeRoundBands([0, w2], barPadding, barOutPadding);
		  
           
		var yScale = d3.scale.linear()
						.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y})])
						.range([h2, 0]);

		var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient('bottom')

						
	
		var yAxis = d3.svg.axis()
						.scale(yScale)
                        .ticks(3)
						.tickFormat(format)
						.orient('left');	

        var yAxisLabel = svg2.append('text')
							.attr("transform", "rotate(-90)")
                            .attr("y", 65 - margin.left)
                            .attr("x", 0 - (h2 / 2))
							.attr('class', 'labels')
							.attr('text-anchor', 'middle')
							.text("Missings");
		
		
		svg2.append('g')
			.call(xAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(0 ,' + h2 +')');			
	
		svg2.append('g')
			.call(yAxis)
			.attr('class', 'axis');
		
        
         var layer = svg2.selectAll('layer')
            .data(stacked)
            .enter()
			.append('g')
            .attr('class', 'layer')
            .style('fill', function(d, i){return colors[i]});
	

           
        var rect = layer.selectAll('rect')
            .data(function(d){return d})
            .enter()
			.append('rect')
            .attr('x', function(d) {return xScale(d.x)})
            .attr('y', function(d) {return yScale(d.y + d.y0)})
            .attr('height', function(d) {return yScale(d.y0) - yScale(d.y + d.y0)})
            .attr("width", xScale.rangeBand())
			.attr('class', 'rect')
			.on('mouseover', function(d) {		
				tip.transition()			
					.style('opacity', .9);		
				tip.html('<strong>' +d.label + '</strong>: ' + d3.format('.2f')(d.y))	
					.style('left', (d3.event.pageX) + 'px')		
					.style('top', (d3.event.pageY) + 'px');	
            })					
			.on('mouseout', function(d) {		
				tip.transition()			
					.style('opacity', 0);	
			});
        
        var yAxisLabel3 = svg2.append('text')
							.attr('transform', 'translate(' + (65 - margin.left) + ',' + (-margin.top/2) + ')')
							.attr('class', 'labels')
							.attr('text-anchor', 'middle')
							.text("Invalid cases");
            
};