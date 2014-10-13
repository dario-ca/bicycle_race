function drawQuery_Demographics(id) {
	
	console.log("\t- Draw Query Options: Rider Demographics");

	/////////////////////////////////////////////////////////////
	/* DUMMY IMPLEMENTATION: SVG IMAGE */
	/////////////////////////////////////////////////////////////
	var queryoption = d3.select(id);

	queryoption.selectAll("svg > *").remove();

	queryoption.append("svg").attr("width",1000).attr("height",1000)
		.attr("border","solid 1px black");

	queryoption.append("svg:image")
		.style("stroke","red").style("fill","blue") // Change color ???
		.attr("fill","yellow")
		.attr("background-color","green")
		.attr("color","cyan")
		.attr("xlink:href", "icons/svg/female105.svg")
		.attr("width", 500)
		.attr("height", 500)
		.attr("x",100)
		.attr("y",50)
   
	
	/////////////////////////////////////////////////////////////

}
