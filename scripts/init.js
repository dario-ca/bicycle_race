function init(DOC) {
	
	console.log("Initialize Page...");
	
	/* Getting ID's from HTML document DOC */
	mapid = DOC.getElementById("map");
	graphiconid = DOC.getElementById("graphicons");
	graphid = DOC.getElementById("graph");
	
	/* Calling functions */
	drawMap(mapid);
	drawGraphIcons(graphiconid);
	drawGraph(graphid);
	
	console.log("Done");

};