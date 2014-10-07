function drawGraph(id) {
	
	console.log("\t- Draw Graph");

	/////////////////////////////////////////////////////////////
	/* DUMMY IMPLEMENTATION: DRAW CIRCLE */
	/////////////////////////////////////////////////////////////
	var map = d3.select(id)
		.append("svg").attr("width",1000).attr("height",1000);

	map.append("circle")
		.style("stroke","black").style("fill","#888")
		.attr("r",450).attr("cx",500).attr("cy",500)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});
	/////////////////////////////////////////////////////////////

}
