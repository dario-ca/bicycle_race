function drawQuery_Stations(id) {
	
	console.log("\t- Draw Query Options: Stations");

	/////////////////////////////////////////////////////////////
	/* DUMMY IMPLEMENTATION: DRAW CIRCLE */
	/////////////////////////////////////////////////////////////
	var queryoption = d3.select(id);

	queryoption.selectAll("svg > *").remove();

	queryoption.append("svg").attr("width",1000).attr("height",1000)
		.attr("border","solid 1px black");

	queryoption.append("circle")
		.style("stroke","black").style("fill","#888")
		.attr("r",100).attr("cx",150).attr("cy",200)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});
	
	queryoption.append("text")
		.text("A")
		.attr("x",120).attr("y",220)
		.attr("font-family","sans-serif")
		.attr("font-size","100px")
		.attr("fill","blue");
	
	queryoption.append("circle")
		.style("stroke","black").style("fill","#888")
		.attr("r",100).attr("cx",700).attr("cy",700)
		.on("mouseover", function() {
			d3.select(this).style("fill","orange")
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#888");
		});

	queryoption.append("text")
		.text("B")
		.attr("x",670).attr("y",720)
		.attr("font-family","sans-serif")
		.attr("font-size","100px")
		.attr("fill","blue");
	/////////////////////////////////////////////////////////////

}
