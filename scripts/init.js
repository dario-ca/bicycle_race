function init(DOC) {
	
	console.log("Initialize Page...");
	
	/* Getting ID's from HTML document DOC */
	mapid = DOC.getElementById("map");
	graphiconid = DOC.getElementById("graphicons");
	graphid = DOC.getElementById("graph");
	queryoptionid = DOC.getElementById("options");
	
	/* Calling functions */
	drawMap(mapid);
	drawGraphIcons(graphiconid);
	drawGraph(graphid);
	drawQuery_Calendar(queryoptionid);
	
	console.log("Done");

};
