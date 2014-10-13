function init(DOC) {
	
	console.log("Initialize Page...");
	var windowNumber = 1;
    
    filters = new Filters(DOC);
	/* Getting ID's from HTML document DOC */
	mapid			= DOC.getElementById("map");
	graphicon_gender= DOC.getElementById("graphicons_gender");
    graphicon_utype = DOC.getElementById("graphicons_utype");
	graphid			= DOC.getElementById("graph");
	queryoptionid	= DOC.getElementById("options");
    
	
	/* Calling functions */
    BikeMap.init(mapid);
	drawGraphIcons(graphicon_gender);
    drawGraphIcons(graphicon_utype);
	selectGraph(DOC,1);
	selectFilter(DOC,1);
    
	
	console.log("Done");

};
