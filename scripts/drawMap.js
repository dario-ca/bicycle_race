function drawMap(id) {
	
	console.log("\t- Draw Map");

	/////////////////////////////////////////////////////////////
	/* DUMMY IMPLEMENTATION: DRAW CIRCLE */
	/////////////////////////////////////////////////////////////
	var map = d3.select(id)
		.append("svg").attr("width",100).attr("height",100);

	map.append("circle")
		.style("stroke","black").style("fill","#888")
		.attr("r",45).attr("cx",50).attr("cy",50)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});
	/////////////////////////////////////////////////////////////

}
