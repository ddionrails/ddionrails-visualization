var stacked;
var hideMissings;	
var colors;
var format; 
var format_axis;

function organizeData(options, menu2_active){
	
	var rData = JSON.parse(JSON.stringify(rawData))
				
	colors = d3.scale.category20()
		.domain(rData.bi[menu2_active].labels);



  
	if(options.missings == true){
		hideMissings = true
	}
	else{
		hideMissings = false
	}
	
	if(options.percent == true){
		offset = 'expand';
		format = d3.format('0.1%')
		format_axis = d3.format('%');
	}
	else{
		offset = '';
		format = d3.format('');
		format_axis = d3.format('');
	}
	if(options.weights == true){
		dataType = 'weighted'
	}
	else{
		dataType = 'frequencies'
	}
		
	var data  = [];
	var indices = []
	for(i = 0; i < rData.bi[menu2_active].missings.length; i++){
		if(rData.bi[menu2_active].missings[i] == true){
			indices.unshift(i);
		}
	}
				
	for(i in rData.bi[menu2_active].categories){
		id = rData.bi[menu2_active].categories[i].label;
				
		// Gewichtet oder nicht
		var freqs = rData.bi[menu2_active].categories[i][dataType];
			
		// Missings oder nicht
		if(hideMissings == true){
			for(i in indices){
				freqs.splice(indices[i], 1);
			}
		}

		freqs.unshift(id);
		data.push(freqs);
				
	}
		
	var labels = rData.bi[menu2_active].labels;
			if(hideMissings == true){
				for(i in indices){
					labels.splice(indices[i], 1);
				}
			};
			
            var mapped = labels.map(function(dat,i){
                return data.map(function(d){
                    return {x: d[0], y: d[i+1], label: dat};
                })
            });
			
			// normalized or not
			stacked = d3.layout.stack().offset(offset)(mapped);
	}	

function draw_biCatChart(){
	
	d3.selectAll('.chart').remove();
	
	var tip = d3.select('body').append('tip')	
						.attr('class', 'tooltip')				
						.style('opacity', 0);

			var margin = {top: 20, right: 0, bottom: 30, left: 100};
		
			var w =600 - margin.left - margin.right;
			var h = 300 - margin.top - margin.bottom;
			
			barPadding = 0.2;
			barOutPadding = 0.1;
								
			var svg = d3.select('#chart')
						.append('svg')
						.attr('width', w + margin.left + margin.right)
						.attr('height', h + margin.top + margin.bottom)
						.attr('class', 'chart')
						.append('g')
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
			

		var xScale = d3.scale.ordinal()
						.domain(stacked[0].map(function(d) { return d.x; }))
						.rangeRoundBands([0, w], barPadding, barOutPadding);
					
		var yScale = d3.scale.linear()
						.domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y})])
						.range([h, 0]);

		var xAxis = d3.svg.axis()
						.scale(xScale)
						.orient('bottom')

						
	
		var yAxis = d3.svg.axis()
						.scale(yScale)
						.tickFormat(format_axis)
						.orient('left');		

		var yAxisLabel2 = svg.append('text')
							.attr('transform', 'translate(0'  + ',' + (-margin.top/2) + ')')
							.attr('class', 'labels')
							.attr('text-anchor', 'end')
							.text("cases");                    
		
		svg.append('g')
			.call(xAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + h + ')');		
	
		svg.append('g')
			.call(yAxis)
			.attr('class', 'axis');
				
		

         var layer = svg.selectAll('layer')
            .data(stacked)
            .enter()
			.append('g')
            .attr('class', 'layer')
            .style('fill', function(d){
				for(i in d){
					return colors(d[i].label)
				}
			});	

           
        var rect = layer.selectAll('rect')
            .data(function(d){return d})
            .enter()
			.append('rect')
            .attr('x', function(d) {return xScale(d.x)})
            .attr('y', function(d) {return yScale(d.y + d.y0)})
            .attr('height', function(d) {return yScale(d.y0) - yScale(d.y + d.y0)})
            .attr('width', xScale.rangeBand())
			.attr('class', 'rect')
			.on('mouseover', function(d) {
			
				tip.transition()			
					.style('opacity', .9);		
				tip.html('<strong>' + d.label + ':</strong> ' + format(d.y))	
					.style('left', (d3.event.pageX) + 'px')		
					.style('top', (d3.event.pageY) + 'px');	
            })					
			.on('mouseout', function(d) {		
				tip.transition()			
					.style('opacity', 0);	
			});
		
}




