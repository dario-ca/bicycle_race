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
    chart4 = DOC.getElementById("chart4");
	
	/* Calling functions */
	drawMap(mapid);
	drawGraphIcons(graphiconid);
	drawGraph(graphid);
	drawQuery_Calendar(queryoptionid);
    app1 = new LineChart1(chart1,DOC.getElementById("titlebar1"));
    app2 = new BarChart1(chart2,DOC.getElementById("titlebar2"));
    app3 = new BarChart4(chart3, DOC.getElementById("titlebar3"));
    app4 = new LineChart2(chart4,DOC.getElementById("titlebar4"));
	
	console.log("Done");

};
