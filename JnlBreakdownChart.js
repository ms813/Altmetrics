function jnlBreakdownChart(journalScores, outputContainerId) {

	var margin = {top: 20, right: 30, bottom: 150, left: 40};
	var width = $(window).width() - margin.left - margin.right;
	var height = 600 - margin.top - margin.bottom;

	function sortByJournalName(a, b){
		if(a.journal.Journal < b.journal.Journal ) return -1;
		if(a.journal.Journal  > b.journal.Journal ) return 1;
		return 0;
	}

	$.each(journalScores, function(j, publisher){			
	
		if(publisher.publisher != "unknown"){

			var pubAvg = (function(publisher){

						var avg = { week : 0, month : 0, quarter : 0, year : 0 },
						jnlCount = 0;

						$.each(publisher.journals, function(i, journal){
							jnlCount++;
							$.each(journal.averageScore, function(timescale, score){
								avg[timescale] += score;	
							})				
						});
						
						$.each(avg, function(timescale, score){
							avg[timescale] /= jnlCount;
						})
						console.log(avg)
						return avg;
					})(publisher);

			var data = publisher.journals.sort(sortByJournalName)
			var svg = d3.select('#' + outputContainerId)
				.append("svg")
				.attr('class', 'chart')
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate (" + margin.left + "," + margin.top + ")");

			var y = d3.scale.linear()
				.range([height, 0])
				.domain([0, d3.max(publisher.journals, function(d){
					var max	= 0;
					$.each(d.averageScore, function(i, x){
						if(x > max) max = x;
					})				
					return max;
				})]);						

			var dmn = [];
			$.each(publisher.journals, function(i, jnl){ dmn.push(jnl.journal.Journal)});						
			var x = d3.scale.ordinal()	
				.domain(dmn)
				.rangeRoundBands([0, width], .1);

			var color = d3.scale.category10();

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

			var line = d3.svg.line()
			    .interpolate("linear")
			    .x(function(d) { return x(d.journal) + x.rangeBand()/2; })
			    .y(function(d) { return y(d.score); });

			color.domain(d3.keys(data[0].averageScore).filter(function(key) { return key; }));

			var scores = color.domain().map(function(name) {
			    return {
					name: name,
					values: data.map(function(d) {		      	
						return {
							journal: d.journal.Journal, 
							score: d.averageScore[name]
						};
					})
			    };
			});			

			var jnl = svg.selectAll(".jnl")
				.data(scores)
			.enter().append("g")
				.attr("class", "jnlLine");

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

			jnl.append("path")
				.attr("class", "line")
				.attr("d", function(d){return line(d.values)})
				.style("stroke", function(d) { return color(d.name); })
				.style("fill", "none")
				.style("stroke-width", 2);

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
				    return d;
				});			
			
			//plot average lines
			$.each(['week', 'month', 'quarter', 'year'], function(i, timescale){
				svg.append("line")	
				.attr("class", "avgLine")			
				.attr("x1", 0)
				.attr("x2", width)
				.attr("y1", y(pubAvg[timescale]))
				.attr("y2", y(pubAvg[timescale]))
				.style("stroke", color(timescale))
				.style("stroke-dasharray", ("5, 5"));
			});	

			svg.append("text")	
		        .attr("x", (width / 2))             
		        .attr("y", 0)
		        .attr("text-anchor", "middle")  
		        .style("font-size", "24px") 
		        .style("text-decoration", "underline")  
		        .text(publisher.publisher);			
		}
	});

}