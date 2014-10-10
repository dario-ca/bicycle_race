function init(DOC) {
	
	console.log("Initialize Page...");
	
	/* Getting ID's from HTML document DOC */
	mapid = DOC.getElementById("map");
	graphiconid = DOC.getElementById("graphicons");
	graphid = DOC.getElementById("graph");
	queryoptionid = DOC.getElementById("options");
    chart1 = DOC.getElementById("chart1");
    chart2 = DOC.getElementById("chart2");
    chart3 = DOC.getElementById("chart3");
	
	/* Calling functions */
    BikeMap.init(mapid);
	drawGraphIcons(graphiconid);
	drawGraph(graphid);
	drawQuery_Calendar(queryoptionid);
    bar_App1 = new BarChart1(chart1,DOC.getElementById("titlebar1"));
    bar_App2 = new BarChart2(chart3,DOC.getElementById("titlebar3"));
    bar_App3 = new BarChart3(chart2,DOC.getElementById("titlebar2"));
    bar_App4 = new LineChart2(chart4,DOC.getElementById("titlebar4"));
	
	console.log("Done");

};
