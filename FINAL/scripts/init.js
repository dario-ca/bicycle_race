function init(DOC) {
	
	console.log("Initialize Page...");
	var windowNumber = 1;
    
    filters = new Filters(DOC);
	/* Getting ID's from HTML document DOC */
	mapid			= DOC.getElementById("map");
    mapid2           = DOC.getElementById("map2");
    graphicon_mapcount = DOC.getElementById("graphicon_mapcount");
    graphicon_theme = DOC.getElementById("graphicon_theme");
    graphicon_home = DOC.getElementById("graphicon_home");
    graphicon_active = DOC.getElementById("graphicon_active");
	graphicon_demographics = DOC.getElementById("graphicon_demographics");
    graphicon_time = DOC.getElementById("graphicon_time");
	graphid			= DOC.getElementById("graph");
	queryoptionid	= DOC.getElementById("options");
    
	
	/* Calling functions */

	function changeOneTwoMap() { toggleMap(); }
	function changeTheme() { toggleTheme(); }
	function goToHome() { selectGraph(DOC,0); }
	function goToActive() { selectFilter(DOC,0); }
	function goToDemographics() { selectFilter(DOC,1); }
	function goToTime() { selectFilter(DOC,2); }

    // quick fix for double maps and graph to work
    selectedStations = [];
    BikeMap = new drawMap();
    SecondBikeMap = new drawMap();
		
    BikeMap.init(mapid, 1);
    SecondBikeMap.init(mapid2, 2);

    
	weatherIcon = new WeatherForecast("#weatherIconBox","tempPar");
    // SecondWeatherIcon = new WeatherForecast("#weatherIconBox","tempPar");

    drawDarkGraphIcon(graphicon_mapcount,'two298',changeOneTwoMap);
    drawDarkGraphIcon(graphicon_theme,'sun4',changeTheme);
    drawDarkGraphIcon(graphicon_home,'house28',goToHome);
    
	drawGraphIcon(graphicon_active,'active4',goToActive);
	drawGraphIcon(graphicon_demographics,'female105',goToDemographics);
    drawGraphIcon(graphicon_time,'calendar68',goToTime);
	
	selectGraph(DOC,0);
	goToActive();
    
	console.log("Done");

};
