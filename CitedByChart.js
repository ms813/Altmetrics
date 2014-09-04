function citedByChart(journalScores, outputId){
	
	var margin = {top: 20, right: 40, bottom: 150, left: 40},
	width =  $(window).width() - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

	function sortByJournalName(a, b){
		if(a.journal.Journal < b.journal.Journal ) return -1;
		if(a.journal.Journal  > b.journal.Journal ) return 1;
		return 0;
	}

	var tooltip = d3.select("body")
     	.append("div")
     	.attr("class", "tooltip");

	$.each(journalScores, function(i, publisher){
		publisher.journals.sort(sortByJournalName)
		if(publisher.publisher != "unknown"){

			var data = publisher.journals;

			var dmn = [];
			$.each(data, function(i, jnl){ dmn.push(jnl.journal.Journal)});						
			var x = d3.scale.ordinal()	
				.domain(dmn)
				.rangeRoundBands([0, width], .1);

			var y = d3.scale.linear()
				.rangeRound([height, 0])
				.domain([0, d3.max(data, function(d){ 				
					var jTot = 0;					
					$.each(d.citedBy, function(ii, datum){						
						jTot += datum;									
					});
					return jTot;
				})]);

			var color = d3.scale.category20();

			var xAxis = d3.svg.axis()
				.scale(x)     
				.orient("bottom");

			var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.tickFormat(d3.format(".2s"));

			var svg = d3.select("#"+outputId).append("svg")
			.attr('class', 'chart')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			color.domain(d3.keys(data[0].citedBy).filter(function(key) { return key; }));

			data.forEach(function(d){
				var y0 = 0;
				d.types = color.domain().map(function(name){
					return {
						name : name,
						y0: y0,
						y1 : y0 += d.citedBy[name],
						parent : d
					}
				})
			})


			svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
				.selectAll("text")
				.style("text-anchor", "end")
		            .attr("dx", "-.8em")
		            .attr("dy", ".15em")
		            .attr("transform", function(d) {
		                return "rotate(-65)" 
		            });

			svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Citations");

			var tooltip = d3.selectAll(".tooltip");

			var journal = svg.selectAll(".journal")
				.data(data)
				.enter().append("g")
				.attr("class", "g")
				.attr("transform", function(d){return "translate(" + x(d.journal.Journal) + ",0)";});

			journal.selectAll("rect")
				.data(function(d) { 					
					return d.types; 
				})
				.enter().append("rect")				
				.attr("width", x.rangeBand())
				.attr("y", function(d) { return y(d.y1); })				
				.attr("height", function(d) { return y(d.y0) - y(d.y1); })
				.style("fill", function(d) { return color(d.name); })
				.on("mouseover", function(d){					
					var t = d.parent.journal['Journal full name'] + "<br>" + 
						"Source: " + AmAPI.cited_by_alias[d.name] + "<br>"+
						"Average no. of mentions: " + (d.y1-d.y0).toFixed(2);

					return tooltip.style("visibility", "visible").html(t);
				})
				.on("mousemove", function(){return tooltip.style("top",
				    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
				.on("mouseout", function(){return tooltip.style("visibility", "hidden");});


				var legend = svg.selectAll(".legend")
				    .data(color.domain().slice().reverse())
				    .enter().append("g")
				    .attr("class", "legend")
				    .attr("transform", function (d, i) {
				    	return "translate(0," + i * 20 + ")";
					});

				legend.append("rect")
				    .attr("x", width - 18)
				    .attr("width", 18)
				    .attr("height", 18)
				    .style("fill", color);

				legend.append("text")
				    .attr("x", width - 24)
				    .attr("y", 9)
				    .attr("dy", ".35em")
				    .style("text-anchor", "end")
				    .text(function (d) {
					    return AmAPI.cited_by_alias[d];
					});

				svg.append("text")	
			        .attr("x", (width / 2))             
			        .attr("y", 0)
			        .attr("text-anchor", "middle")  
			        .style("font-size", "24px") 
			        .style("text-decoration", "underline")  
			        .text(publisher.publisher);	
		}		
	})
}

	