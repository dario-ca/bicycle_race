function init(DOC) {
	
	console.log("Initialize Page...");
	
	/* Getting ID's from HTML document DOC */
	mapid			= DOC.getElementById("map");
	graphiconid		= DOC.getElementById("graphicons");
	graphid			= DOC.getElementById("graph");
	queryoptionid	= DOC.getElementById("options");
    
	
	/* Calling functions */
    BikeMap.init(mapid);
	drawGraphIcons(graphiconid);
	selectGraph(DOC,1);
	// drawQuery_Calendar(queryoptionid);
	// drawQueryMenu(queryoptionid);
    
	
	console.log("Done");

};
