function drawGraphIcons(id) {

	console.log("\t- Create Graph Icons");

	/////////////////////////////////////////////////////////////
	/* DUMMY IMPLEMENTATION: DRAW CIRCLES */
	/////////////////////////////////////////////////////////////
	var icon = d3.select(id)
		.append("svg").attr("width",300).attr("height",100);

	/*
	icon.append("circle")
		.style("stroke","black").style("fill","#888")
		.attr("r",150).attr("cx",200).attr("cy",200)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});
		*/
	/////////////////////////////////////////////////////////////

	icon.append("rect")
		.style("stroke","black").style("fill","#888")
		.attr("x",4).attr("y",4)
		.attr("rx",10).attr("ry",10)
		.attr("height", 92).attr("width", 92)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});
   
	icon.append("rect")
		.style("stroke","black").style("fill","#888")
		.attr("x",104).attr("y",4)
		.attr("rx",10).attr("ry",10)
		.attr("height", 92).attr("width", 92)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});
	
	icon.append("rect")
		.style("stroke","black").style("fill","#888")
		.attr("x",204).attr("y",4)
		.attr("rx",10).attr("ry",10)
		.attr("height", 92).attr("width", 92)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});

}
