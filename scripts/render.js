function render(rawData){
    
	startRendering();
			
    function startRendering(){

        var h = 40;
        
        // Create Array of available options from data modell
        var menu2_data = [];
        for(i in rawData.bi){
            menu2_data.push(i);
        }
        
        // Control active option in menu 2, defaul is 'none', circles are not filled
        var menu2_active = 'none';
        var circle_filled = false;
        
        // Add option 'weighted' to menu 3 if available in data modell
        var menu3_data = ['percent', 'missings'];
        if('weighted' in rawData.uni){
            menu3_data.push('weighted');
        }
        
        // Control active options in menu 3
        var options = {
            'missings': 	false, // hide missings
            'percent':		false, // show in percentages
            'weighted':		false, // use weighted data
        }
        var menu3_active;
        
        // Choose diagram type by scale
        if(rawData.scale == "cat" ){
            cat_uni(options);
        }
        else if(rawData.scale == "num"){
            density(options);
        }
        else{
            console.log("Error. Not defined.")
        }
        
        // Append SVG Element to DOM
        function svg(w, h, selector){
            var svg = d3.select(selector)
                        .append('svg')
                        .attr('width', w)
                        .attr('height', h);
            return svg;
        }
        
        // Set Scales for charts
        function scale(domain, rangeMin, rangeMax){
            var scale = d3.scale.ordinal()
                            .domain(domain)
                            .rangeBands([rangeMin, rangeMax]);
            return scale;
        }
        
        // Menu divided in 3 parts: 
        // Menu 1: var-name
        // Menu 2: show var by available options (bivariate)
        // Menu 3: hide missings, show in percentages, use weighted data
        var menu1_svg = svg(100, h, '#menu');
        var menu2_svg = svg(250, h, '#menu');
        var menu3_svg = svg(250, h, '#menu');
                
        var menu2_scale = scale(menu2_data, 10, 250);
        var menu3_scale = scale(menu3_data, 65, 250);			
                                
        // Menu 1: on click reset all options and show default chart
        menu1_svg.append('text')
            .text(rawData.variable)
            .attr('x', 90)
            .attr('y', h / 2)
            .attr('class', 'menu1_text')
            .on('click', function(){
                        
                d3.selectAll('.menu2_circles').attr('fill', 'white').attr('stroke', 'grey');
                d3.selectAll('.menu3_rects').attr('fill', 'white').attr('stroke', 'grey');
                options = {
                    'missings': 	false,
                    'percent':		false,
                    'weighted':		false,
                }	
                 if(rawData.scale == "cat" ){
                    cat_uni(options);
                }
                if(rawData.scale == "num"){
                    density(options);
                }
                menu2_active = 'none';
            });

        // Append menu elements (text, circles, behaviour) to menu 2
        var menu2 = menu2_svg.selectAll('g')
            .data(menu2_data)
            .enter()
            .append('g');
        

        menu2.append('circle')
            .attr('cx', function(d){ return menu2_scale(d)})
            .attr('cy', 16)
            .attr('r', 5)
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .attr('class', 'menu2_circles');
                
        menu2.append('text')
            .attr('x', function(d){return menu2_scale(d) + 10})
            .attr('y', h / 2)
            .text(function(d){ return d; })
            .attr('class', 'menu2_text');					
                        
                           
        menu2.on('click', function(d){
            menu2_active = d;
            
            try {
                if(rawData.scale == "cat" ){
                    draw_biCatChart(options, menu2_active);
                }
                if(rawData.scale == "num"){
                   density_bi(options, menu2_active); 
                }		
            }
            catch(error) {
                d3.selectAll('.chart').remove();
                d3.select('#chart')
                    .append('svg')
                    .attr('width', 600)
                    .attr('height', 300)
                    .attr('class', 'chart')
                    .append('text')
                    .text('Sorry.Not available.')
                    .attr('x', 300)
                    .attr('y', 100) ;
            };
            

            if(circle_filled == false) {
                d3.selectAll('circle').attr('fill', 'white').attr('stroke', 'grey')
                d3.select(this).select('circle').attr('fill', 'steelblue').attr('stroke', 'steelblue')
                circle_filled = true;
            }
            else {
                d3.selectAll('circle').attr('fill', 'white').attr('stroke', 'grey')
                d3.select(this).select('circle').attr('fill', 'steelblue').attr('stroke', 'steelblue')
                circle_filled = false;
            };	
        });	
        
        // Append menu elements (text, circles, behaviour) to menu 3
        var menu3 = menu3_svg.selectAll('g')
            .data(menu3_data)
            .enter()
            .append('g');

        menu3.append('rect')
            .attr('x', function(d){return menu3_scale(d)})
            .attr('y', 12)
            .attr('height', 9)
            .attr('width', 9)
            .attr("fill", "white")
            .attr("stroke", "grey")
            .attr("stroke-width", 1)
            .attr('class', 'menu3_rects');	
        menu3.append('text')
            .attr('x', function(d){return menu3_scale(d) + 14})
            .attr('y', h / 2)
            .text(function(d){ return d})
            .attr('text-anchor', 'left')
            .attr('font-weight', '')
            .attr('fill', 'grey')
            .attr('font-family', 'sans-serif')
            .attr('font-size', '11px');
            
        menu3.on('click', function(d){
                            
            if(options[d] == false){
                options[d] = true;
                if(menu2_active == 'none' ){
                    if(rawData.scale == "cat" ){
                        cat_uni(options);
                    }
                    if(rawData.scale == "num"){
                        density(options);
                    }
                }
                else{
                     if(rawData.scale == "cat" ){
                        draw_biCatChart(options, menu2_active);
                    }
                    if(rawData.scale == "num"){
                        density_bi(options, menu2_active);
                    }
                }
                d3.select(this).select('rect').attr('fill', 'steelblue').attr('stroke', 'steelblue');	
            }
            else{
                options[d] = false;
                if(menu2_active == 'none' ){
                     if(rawData.scale == "cat" ){
                        cat_uni(options);
                    }
                    if(rawData.scale == "num"){
                        density(options);
                    }
                }
                else{
                if(rawData.scale == "cat" ){
                    draw_biCatChart(options, menu2_active);
                }
                if(rawData.scale == "num"){
                    density_bi(options, menu2_active);
                }
                    
                }
                d3.select(this).select('rect').attr('fill', 'white').attr('stroke', 'grey');
            }
        });
    }
            
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // UNIVARIATE CATEGORY CHART
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Render univariate category chart
    function cat_uni(options){

        d3.selectAll('.chart').remove();
        var rData = rawData; 
        
        // Flags for options to modify data or not
        if(options.missings == true){
            hideMissings = true
        }
        else {
            hideMissings = false
        }
        if(options.weighted == true){
            dataType = 'weighted'
        }
        else{
            dataType = 'frequencies'
        }

        // Build data modell for chart
        data = [];
        for(i = 0;  i < rData.uni[dataType].length; i++){
            if(hideMissings == true && rData.uni.missings[i]){
                continue;
            }
            
            tmp = [rData.uni.values[i], rData.uni.labels[i], rData.uni[dataType][i]];
            data.push(tmp);	
        }
        
        // Set margin, width, height and padding for chart
        var margin = {top: 20, right: 40, bottom: 40, left: 100};
        var w = 600 - margin.left - margin.right;
        var h = (100 + 20 * data.length) - margin.top - margin.bottom;
        var padding = 100;
        var barPadding = 1;
        
        // Create SVG ELement and append to #chart
        var svg = d3.select('#chart')
                    .append('svg')
                    .attr('width', w + margin.left + margin.right)
                    .attr('height', h + margin.top + margin.bottom )
                    .attr('class', 'chart')
                    .append('g')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
                
        // Color Scale
        colors = d3.scale.category20();
        colors.domain(rData.uni.labels)
        
        // Append rect elements and map with data
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
        
        // Define text labels 
        if(options.percent == true){
            var sum =  d3.sum(data.map(function(d){return d[2] }));
            format = d3.format('0.1%');
            text.text(function(d) {return format(d[2] / sum)}) 					
        }
        else {
            text.text(function(d) {return (d[2])})	
        }			
        
        // X-Scale
        var xScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {
                return d3.max(d.filter(function(value) {
                    return typeof value === 'number';
                }));
            })])
            .range([0, w]);
                        
        // Y-Scale
        var yScale = d3.scale.ordinal()
            .domain(data.map(function(d){return ("[" + d[0] + "] " + d[1])}))
            .rangeRoundBands([h, 0]);
                                      
        // X-Axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
            
        svg.append('g')
            .call(xAxis)
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + h + ')');	
                        
        // Y-Axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');				
  
        svg.append('g')
            .call(yAxis)
            .attr('class', 'axis');		

        // Draw bars
        rects.attr('x', 0) 
             .attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1])})
             .attr('width', function(d){return xScale(d[2])}) 
             .attr('height', (h / data.length) - barPadding);			
        
        //Append Labels
        barHeight = (h / data.length) - barPadding; 
        text.attr('x', function(d) {return xScale(d[2]) + 3})
            .attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1]) + (barHeight/2) + 2});

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // BIVARIATE CATEGORY CHART
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
    function draw_biCatChart(options, menu2_active){

        var stacked;
        var hideMissings;	
        var colors;
        var format; 
        var format_axis;

        var rData = JSON.parse(JSON.stringify(rawData));
        
        // Color Scale
        var colors = d3.scale.category20()
            .domain(rData.bi[menu2_active].labels);
        
        // Show missings / hide missings
        if(options.missings == true){
            hideMissings = true
        }
        else {
            hideMissings = false
        }
        
        // Show percentages or not
        if(options.percent == true){
            offset = 'expand';
            format = d3.format('0.1%')
            format_axis = d3.format('%');
        }
        else {
            offset = '';
            format = d3.format('');
            format_axis = d3.format('');
        }
        
        // unweighted or weighted data
        if(options.weighted == true){
            dataType = 'weighted'
        }
        else{
            dataType = 'frequencies'
        }
            
        var data  = [];
        var indices = [];
        for(i = 0; i < rData.bi[menu2_active].missings.length; i++){
            if(rData.bi[menu2_active].missings[i] == true){
                indices.unshift(i);
            }
        }

        // Build data model for chart
        for(i in rData.bi[menu2_active].categories){

            id = rData.bi[menu2_active].categories[i].label;
            var freqs = rData.bi[menu2_active].categories[i][dataType];
        
            if(hideMissings == true){
                for(i in indices){
                    freqs.splice(indices[i], 1);
                }
            }

            freqs.unshift(id);
            data.push(freqs);
        }
        
        // Get Value codes and labels    
        var labels = rData.bi[menu2_active].labels;
        var values = rData.bi[menu2_active].values;
        
        if(hideMissings == true){
            for(i in indices){
                labels.splice(indices[i], 1);
            }
        };
         
        // Map labels with data
        var mapped = labels.map(function(dat,i){
            return data.map(function(d){
                return {x: d[0], y: d[i+1], label: dat, code: values[i]};
            });
        });
                
        // Stack data (normalized or not)
        stacked = d3.layout.stack().offset(offset)(mapped);

        // Remove current chart
        d3.selectAll('.chart').remove();
        
        // Tooltip: on mouseover show label and values
        var tip = d3.select('body').append('tip')	
            .attr('class', 'tooltip')				
            .style('opacity', 0);

        // Set margin, width, height and Padding    
        var margin = {top: 20, right: 0, bottom: 30, left: 100};
        var w =600 - margin.left - margin.right;
        var h = 300 - margin.top - margin.bottom;
        
        barPadding = 0.2;
        barOutPadding = 0.1;
      
        // Create SVG ELement and append to #chart 
        var svg = d3.select('#chart')
                    .append('svg')
                    .attr('width', w + margin.left + margin.right)
                    .attr('height', h + margin.top + margin.bottom)
                    .attr('class', 'chart')
                    .append('g')
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
             
        // X-Scale
        var xScale = d3.scale.ordinal()
                        .domain(stacked[0].map(function(d) { return d.x; }))
                        .rangeRoundBands([0, w], barPadding, barOutPadding);
        
        // Y-Scale
        var yScale = d3.scale.linear()
                        .domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y})])
                        .range([h, 0]);
        
        // X-Axis
        var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient('bottom');
        
        svg.append('g')
            .call(xAxis)
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + h + ')');		

        // Y-Axis
        var yAxis = d3.svg.axis()
                        .scale(yScale)
                        .tickFormat(format_axis)
                        .orient('left');		

        svg.append('g')
            .call(yAxis)
            .attr('class', 'axis');
                
            
        // Draw Bars
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
            .on('mouseover', function(d, i) {
            
                tip.transition()			
                    .style('opacity', .9);		
                tip.html('<strong>' + "[" + d.code + "] " +  d.label + ':</strong> ' + format(d.y))	
                    .style('left', (d3.event.pageX) + 'px')		
                    .style('top', (d3.event.pageY) + 'px');	
            })					
            .on('mouseout', function(d) {		
                tip.transition()			
                    .style('opacity', 0);	
            });
        
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // UNIVARIATE DENSITY CHART
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // Density draws to charts: density chart + missings chart    
    function density(options){
    
        // Remove current charts
        d3.selectAll('.chart').remove();
        d3.select('.chart_missings').remove();
    
		var rData = JSON.parse(JSON.stringify(rawData))

		if(options.weighted == true){
			dataType = 'weighted'
		}
		else{
			dataType = 'density'
		}
		
		if(options.weighted == true){
			dataType_missings = 'weighted'
		}
		else{
			dataType_missings = 'frequencies'
		}

        // Build data model for density chart 
        var data = [];
        var range = d3.range(rData.uni.min, rData.uni.max + 1, rData.uni.by);
        range.map(function(d, i){
           
            tmp = [range[i], rData.uni[dataType][i]];
            data.push(tmp);
            
        })

        // Set margin, width, height and padding for chart
		var margin = {top: 20, right: 40, bottom: 40, left: 100};
		var w = 600 - margin.left - margin.right;
		var h = 300 - margin.top - margin.bottom;
	
        // Create SVG ELement and append to #chart 
		var svg = d3.select('#chart')
            .append('svg')
            .attr('width', w + margin.left + margin.right)
            .attr('height', h + margin.top + margin.bottom)
            .attr('class', 'chart')
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	

        // X-Scale
		var xScale = d3.scale.ordinal()
            .domain(range)
            .rangePoints([0, w], 0.5);
		
        // Y-Scale
		var yScale = d3.scale.linear()
            .domain([0, d3.max(rData.uni[dataType])])
            .range([h, 0]);
		
		// X-Axis
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('bottom');
            
		svg.append('g')
			.call(xAxis)
			.attr('class', 'axis')
			.attr('transform', 'translate(0,' + h + ')')			
        
        // Apend path 
		var path = d3.svg.line()
					 .x(function(d) {return xScale(d[0])})
					 .y(function (d) {return yScale(d[1])})
					 .interpolate('linear');
					 
		svg.append('path')
			.attr('class', 'line')
			.attr('d', path(data));	
		
		// Missings Chart // 
        
        if(options.missings == false){
		
            var rData = rawData;

            // Prepare data
            var dataMissings = [];
            for(i = 0;  i < rData.uni.missings[dataType_missings].length; i++){
                
                tmp = [rData.uni.missings.values[i], rData.uni.missings.labels[i], rData.uni.missings[dataType_missings][i]];
                dataMissings.push(tmp);	
            }
            
            // Add category for vaild cases
            sumValidData =  d3.sum(data.map(function(d){return d[1] }));
            dataMissings.push([" ", "valid cases", sumValidData])
           
            // Set margin, width, height and padding for chart
            var w = 600 - margin.left - margin.right;
            var h = (80 + 10 * dataMissings.length) - margin.top - margin.bottom;
            
            // Append SVG-Element for missings chart
            var svg2 = d3.select('#chart_missings')
                            .append('svg')
                            .attr('width', w + margin.left + margin.right)
                            .attr('height', h + margin.top + margin.bottom)
                            .attr('class', 'chart_missings')
                            .append('g')
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
            
            // Color Scale (grey)
            var colors = ['#d9d9d9','#969696', '#000000', '#ffffff','#f0f0f0','#bdbdbd','#525252', '#737373','#252525', '#d9d9d9','#969696', '#000000', '#ffffff','#f0f0f0','#bdbdbd','#525252', '#737373','#252525'];
           
            // Append rect elements
            var rects = svg2.selectAll('rect')
                .data(dataMissings)
                .enter()
                .append('rect')
                .style('fill', function(d, i){
                    if(d[1] == "valid cases"){
                        return 'steelblue';
                    }else {
                        return colors[i];
                    }
                 })
                .attr('class', 'rects');
            
            // Append labels
            text = svg2.selectAll('text')
                        .data(dataMissings)
                        .enter()
                        .append('text')
                        .attr('class', 'text');
        
            // Show missings  in % or not
            sumAllData = sumValidData + d3.sum(rData.uni.missings[dataType_missings]);
            if(options.percent == true){
                format = d3.format('0.1%');
                text.text(function(d) {return format(d[2] / sumAllData)}) 					
            }
            else{
                text.text(function(d) {return (d[2])});	
            }			

            // X-Scale missings
            var xScale = d3.scale.linear()
                .domain([0, d3.max(dataMissings, function(d) {
                    return d3.max(d.filter(function(value) {
                    return typeof value === 'number';
                    }));
                })])
                .range([0, w]);
                            
            // Y-Scale missings
            var yScale = d3.scale.ordinal()
                .domain(dataMissings.map(function(d){return ("[" + d[0] + "] " + d[1]) }))
                .rangeRoundBands([h, 0]);
                    
                        
            // X-Axis missings
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');
                
            svg2.append('g')
                .call(xAxis)
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + h + ')');
                            
            // Y-Axis missings
            var yAxis = d3.svg.axis()
                .scale(yScale)
                .orient('left');				
   
            svg2.append('g')
                .call(yAxis)
                .attr('class', 'axis');			
            
            // Draw bars and append labels 
            rects.attr('x', 0) 
                 .attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1])})
                 .attr('width', function(d){ return xScale(d[2])}) 
                 .attr('height', (h / dataMissings.length) - 1);		


            barHeight = (h / dataMissings.length) - 1;
            text.attr('x', function(d) { return xScale(d[2])+ 3})
                .attr('y', function(d) {return yScale("[" + d[0] + "] " + d[1]) + (barHeight/2)+2});
                
         
	   }
       
	   if(options.missings == true){
		   d3.select('.chart_missings').remove();
	   }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // BIVARIATE DENSITY CHART
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function density_bi(options, menu2_active){
        
        // Remove current chart
        d3.selectAll('.chart').remove();
        d3.select('.chart_missings').remove();

        var rData = JSON.parse(JSON.stringify(rawData))
        var data  = [];
        var labels = [];
        
        // Unweighted / weighted
        if(options.weighted == true){
            dataType = 'weighted'
        }
        else{
            dataType = 'density'
        }
        
        // Prepare Data 
        var range = d3.range(rData.uni.min, rData.uni.max + 1, rData.uni.by);
        for(i in rData.bi[menu2_active].categories){
            
            id = rData.bi[menu2_active].categories[i].label;
            freqs = rData.bi[menu2_active].categories[i][dataType];
                
            //freqs.unshift(id);
            data.push(freqs);
            labels.push(id);
                
        }
    
        // Set margin, width, height and padding for chart
        var margin = {top: 20, right: 0, bottom: 30, left: 100};
        var w =600 - margin.left - margin.right;
        var h = 300 - margin.top - margin.bottom;
       
        // Append SVG-Element to #chart
        var svg = d3.select('#chart')
                        .append('svg')
                        .attr('width', w + margin.left + margin.right)
                        .attr('height', h + margin.top + margin.bottom)
                        .attr('class', 'chart')
                        .append('g')
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");	
        
        // X-Scale
        var xScale = d3.scale.ordinal()
            .domain(labels)
            .rangeRoundBands([0, w], 0, 0);
            
        // Y-Scale                
        var yScale = d3.scale.ordinal()
                        .domain(range)
                        .rangeRoundBands([h, 0], 0, 0.5);
        
        // X-Axis
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient('bottom');
            
        svg.append('g')
            .call(xAxis)
            .attr('class', 'axis')
            .attr('transform', 'translate(0,' + h + ')');				
    
        
        // Y-Axis
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left');
        
        svg.append('g')
            .call(yAxis)
            .attr('class', 'axis');

        var gAxis = svg.append("g")
            .attr('class', 'axis')
            .call(yAxis);
            
        // Calculate maximum length of axis ticks in order to avoid an overlap with axis label
        var maxLabelWidth = 0;
        gAxis.selectAll("text").each(function () {
            var width = this.getBBox().width;
            if (width > maxLabelWidth){
                maxLabelWidth = width;
            } 
        });
    
        // Append y-Axis Label
        var yAxisLabel = svg.append('text')
                            .attr('transform', 'translate(' + (-maxLabelWidth-15) + ',' + (h/2) + ')rotate(-90)')
                            .attr('class', 'labels')
                            .attr('text-anchor', 'middle')
                            .text(rData.label);
                            
        // Add a minified, mirrored path diagram for each category 
        for(i = 0; i < data.length; i++){
        
            var xScale2 = d3.scale.ordinal()
                .domain(d3.range(rData.uni.min, rData.uni.max + 1, rData.uni.by))
                .rangeRoundBands([0, h], 0, 0.5);
                            
                            
            var yScale2 = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d3.max(d); })])
                .range([(xScale.rangeBand()* (i) + (xScale.rangeBand()/2)), ((xScale.rangeBand()* (i+1))-5)]);

            var path = d3.svg.area()
                .x(function(d, i) { return xScale2(range[i])})
                .y(function (d) {return yScale2(d)})
                .y0(function (d) {return yScale2(-d)})
                .interpolate('linear');
                            
            svg.append('path')
                .attr('class', 'line')
                .attr('d', path(data[i]))
                .attr("transform", "rotate(-90)")
                .style("fill", "steelblue")
                .attr('transform', 'translate(0,' + h + ') rotate(-90)')

            
        }	
        

        // Missings Chart // 

        if(options.missings == false){
            
            var tip = d3.select('body').append('tip')	
                                .attr('class', 'tooltip')				
                                .style('opacity', 0);
                                
            if(options.percent == true){
                offset = 'expand';
                format = d3.format('0.1%')
                format_axis = d3.format('%');
            } else{
                offset = '';
                format = d3.format('')
                format_axis = d3.format('');
            }
            if(options.weighted == true){
                dataType_missings = 'weighted'
            } else{
                dataType_missings = 'frequencies'
            }

            
            var data  = [];	
            for(i in rData.bi[menu2_active].categories){
                id = rData.bi[menu2_active].categories[i].label;
         
                sumValidCases = d3.sum(rData.bi[menu2_active].categories[i][dataType]);
                freqs = rData.bi[menu2_active].categories[i].missings[dataType_missings];
                         
                freqs.unshift(id);
                freqs.push(sumValidCases);
                data.push(freqs);
                    
            }
            
             // Sum valid Cases (in all categories)
            var sumValidData =  d3.sum(data);
               
            labels = rData.bi[menu2_active].categories[0].missings.labels;
            values = rData.bi[menu2_active].categories[0].missings.values;
            
            // Add category for valid cases 
            labels.push("valid cases");
            values.push(" "); // no code for valid cases 
            
            // Map labels with data
            var mapped = labels.map(function(dat,i){
                return data.map(function(d){
                    return {x: d[0], y: d[i+1], label: dat, code: values[i]};
                })
            });
            
            // Stack data (normalized or not)
            var stacked = d3.layout.stack().offset(offset)(mapped);
  
            // Set width, height and padding for missings chart
            var w2 = 600 - margin.left - margin.right;
            var h2 = 150 - margin.top - margin.bottom;
            var barPadding = 0.2;
            var barOutPadding = 0.1;     
             
           
            // Append SVG Element to #chart_missings
            var svg2 = d3.select('#chart_missings')
                .append('svg')
                .attr('width', w2 + margin.left + margin.right)
                .attr('height', h2 + margin.top + margin.bottom)
                .attr('class', 'chart_missings')
                .append('g')
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           
            // X-Scale             
            var xScale = d3.scale.ordinal()
                .domain(stacked[0].map(function(d) { return d.x; }))
                .rangeRoundBands([0, w2], barPadding, barOutPadding);
              
            // Y-Scale   
            var yScale = d3.scale.linear()
                .domain([0, d3.max(stacked[stacked.length - 1], function(d) { return d.y0 + d.y})])
                .range([h2, 0]);

            // X-Axis
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');
                
            svg2.append('g')
                .call(xAxis)
                .attr('class', 'axis')
                .attr('transform', 'translate(0 ,' + h2 +')');			

            // Y-Axis
            var yAxis = d3.svg.axis()
                            .scale(yScale)
                            .ticks(3)
                            .tickFormat(format_axis)
                            .orient('left');	
                            
            svg2.append('g')
                .call(yAxis)
                .attr('class', 'axis');
            
             // Color Scale (grey) 
            var colors = ['#d9d9d9','#969696', '#000000', '#ffffff','#f0f0f0','#bdbdbd','#525252', '#737373','#252525', '#d9d9d9','#969696', '#000000', '#ffffff','#f0f0f0','#bdbdbd','#525252', '#737373','#252525'];
            
            // Append bars
            var layer = svg2.selectAll('layer')
                .data(stacked)
                .enter()
                .append('g')
                .attr('class', 'layer')
                .style('fill', function(d, i){
                    if(d[0].label == 'valid cases'){
                        return 'steelblue';
                    } else {
                        return colors[i];
                }});
          
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
                    tip.html('<strong>' + "[" + d.code + "] " + d.label + ': </strong>' + format(d.y))	
                        .style('left', (d3.event.pageX) + 'px')		
                        .style('top', (d3.event.pageY) + 'px');	
                })					
                .on('mouseout', function(d) {		
                    tip.transition()			
                        .style('opacity', 0);	
                });
            

        }
        
        if(options.missings == true){
            d3.select('.chart_missings').remove();
        }      
    }      
}