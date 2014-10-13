function drawQuery_Calendar(id) {
	
	console.log("\t- Draw Query Options: Calendar");

	/////////////////////////////////////////////////////////////
	/* DUMMY IMPLEMENTATION: DRAW RECTANGLE */
	/////////////////////////////////////////////////////////////
	var queryoption = d3.select(id);

	queryoption.selectAll("svg > *").remove();
	
	queryoption.append("svg").attr("width",1000).attr("height",1000)
		.attr("border","solid 1px black");

	queryoption.append("rect")
		.style("stroke","black").style("fill","blue")
		.attr("x",200).attr("y",100)
		.attr("width",600).attr("height",800)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});
	/////////////////////////////////////////////////////////////

}
