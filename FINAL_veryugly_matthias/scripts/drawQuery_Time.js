function drawQuery_Time(id) {
	
	console.log("\t- Draw Query Options: Time of Day");

	/////////////////////////////////////////////////////////////
	/* DUMMY IMPLEMENTATION: SVG IMAGE */
	/////////////////////////////////////////////////////////////
	var queryoption = d3.select(id);

	queryoption.selectAll("svg > *").remove();

	queryoption.append("svg").attr("width",1000).attr("height",1000)
		.attr("border","solid 1px black");

	queryoption.append("svg:image")
		.attr("xlink:href", "icons/svg/watch.svg")
		.attr("width", 500)
		.attr("height", 500)
		.attr("x",100)
		.attr("y",50)
   
	
	/////////////////////////////////////////////////////////////

}
