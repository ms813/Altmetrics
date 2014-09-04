function jnlBreakdownChart(journalScores, outputContainerId) {
	var barPadding = 1;	
	var margin = {top: 20, right: 30, bottom: 150, left: 40};
	var chartWidth = $(window).width()*0.9 - margin.left - margin.right;
	var chartHeight = 313 - margin.top - margin.bottom;

	function sortByScore (a, b){
		if(parseFloat(a.averageScore.year) < parseFloat(b.averageScore.year)) return -1;
		if(parseFloat(a.averageScore.year) > parseFloat(b.averageScore.year)) return 1;
		return 0;
	}

	

	$.each(journalScores, function(j, publisher){	

		publisher.journals.sort(sortByJournalName)
		var timescales = ['week', 'month', 'year'];

		var tooltip = d3.select("body")
			     	.append("div")
			     	.attr("class", "tooltip");

		if(publisher.publisher != "unknown"){

			$.each(timescales, function(i, timescale){
				var svg = d3.select('#' + outputContainerId)
					.append("svg")
					.attr("width", chartWidth + margin.left + margin.right)
					.attr("height", chartHeight + margin.top + margin.bottom)
				.append("g")
					.attr("transform", "translate (" + margin.left + "," + margin.top + ")");

				var scaleY = d3.scale.linear()
								.range([chartHeight, 0])
								.domain([0, d3.max(publisher.journals, function(d){ return parseFloat(d.averageScore[timescale]);})]);						

				var dmn = [];
				$.each(publisher.journals, function(i, jnl){ dmn.push(jnl.journal.Journal)});						
				var scaleX = d3.scale.ordinal()	
						.domain(dmn)
						.rangeRoundBands([0, chartWidth], .1);

				var xAxis = d3.svg.axis()
					.scale(scaleX)
					.orient("bottom");

				var yAxis = d3.svg.axis()
				    .scale(scaleY)
				    .orient("left");				

				svg.selectAll('.bar')
					.data(publisher.journals)
					.enter()
					.append('rect')
					.attr("fill", PublisherConstants.getColor(publisher.publisher))
					.attr("x", function(d){return scaleX(d.journal.Journal)})
					.attr("y", function(d){return scaleY(d.averageScore[timescale])})
					.attr("width", scaleX.rangeBand())
					.attr("height", function(d){ return chartHeight -scaleY(d.averageScore[timescale]);})
					.on("mouseover", function(d){	
						var t = d.journal['Journal full name']+ "<br>" + 
							"Avg Score: " + d.averageScore[timescale] + "<br>"+
							"No of Articles: " + d.articleCount[timescale];

						return tooltip.style("visibility", "visible").html(t);
					})
					.on("mousemove", function(){return tooltip.style("top",
					    (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
					.on("mouseout", function(){return tooltip.style("visibility", "hidden");});

				svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + chartHeight + ")")
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
			      	    .text("Average Altmetric Score");

				svg.append("text")	
			        .attr("x", (chartWidth / 2))             
			        .attr("y", 0)
			        .attr("text-anchor", "middle")  
			        .style("font-size", "16px") 
			        .style("text-decoration", "underline")  
			        .text(publisher.publisher + " last " + timescale);			     				    		    
			})			
		}
		
	});	

	console.log("Displaying completed journal breakdown plots");
}