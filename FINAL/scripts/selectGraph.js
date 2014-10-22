function selectGraph(DOC, n) {

    console.log("\t- Draw Graph" + n);
    windowNumber = n;
    resetFilters();

	switch (n) {
		
		case 0:
			$('#center').load('dynamic_html/center_welcome.html');
			break;
		
		case 3:
			$('#center').load('dynamic_html/center_2graphs.html');
			prepareGraph2();
			break;
        
        case 5:
			$('#center').load('dynamic_html/center_4graphs_comparisons.html');
			prepareGraph4_comparisons();
			break;
		
		default:
			$('#center').load('dynamic_html/center_4graphs.html');
			prepareGraph4();
			break;
	}


	function prepareGraph2() {

		var waitForLoad = function () {
			
			chart5 = DOC.getElementById("chart5");
			chart6 = DOC.getElementById("chart6");

			title1 = DOC.getElementById("titlebar1");
			title2 = DOC.getElementById("titlebar2");
		
			var chartsready = (typeof chart5 !== "undefined") && (typeof chart6 !== "undefined");
			var titlesready = (typeof title1 !== "undefined") && (typeof title2 !== "undefined");
			if (chartsready && titlesready) {
				console.log("OK - dynamic html loaded");
				drawAfterLoad();
				// invoke any methods defined in your JS files to begin execution       
			} else {
				console.log("dynamic html not loaded..");
				window.setTimeout(waitForLoad, 500);
			}
		 };

		 window.setTimeout(waitForLoad, 500);   
	}


	function prepareGraph4() {

		var waitForLoad = function () {
			
			chart1 = DOC.getElementById("chart1");
			chart2 = DOC.getElementById("chart2");
			chart3 = DOC.getElementById("chart3");
			chart4 = DOC.getElementById("chart4");

			title1 = DOC.getElementById("titlebar1");
			title2 = DOC.getElementById("titlebar2");
			title3 = DOC.getElementById("titlebar3");
			title4 = DOC.getElementById("titlebar4");
		
			var chartsready = (typeof chart1 !== "undefined") && (typeof chart2 !== "undefined") && (typeof chart3 !== "undefined") && (typeof chart4 !== "undefined");
			var titlesready = (typeof title1 !== "undefined") && (typeof title2 !== "undefined") && (typeof title3 !== "undefined") && (typeof title4 !== "undefined");
			if (chartsready && titlesready) {
				console.log("OK - dynamic html loaded");
				drawAfterLoad();
				// invoke any methods defined in your JS files to begin execution       
			} else {
				console.log("dynamic html not loaded..");
				window.setTimeout(waitForLoad, 500);
			}
		 };

		 window.setTimeout(waitForLoad, 500);   
	}
    
    function prepareGraph4_comparisons() {

		var waitForLoad = function () {
			
			chart1 = DOC.getElementById("chart7");
			chart2 = DOC.getElementById("legend7");
			chart3 = DOC.getElementById("chart8");
			chart4 = DOC.getElementById("legend8");

			title1 = DOC.getElementById("titlebar7");
			title2 = DOC.getElementById("titlelegend7");
			title3 = DOC.getElementById("titlebar8");
			title4 = DOC.getElementById("titlelegend8");
		
			var chartsready = (typeof chart1 !== "undefined") && (typeof chart2 !== "undefined") && (typeof chart3 !== "undefined") && (typeof chart4 !== "undefined");
			var titlesready = (typeof title1 !== "undefined") && (typeof title2 !== "undefined") && (typeof title3 !== "undefined") && (typeof title4 !== "undefined");
			if (chartsready && titlesready) {
				console.log("OK - dynamic html loaded");
				drawAfterLoad();
				// invoke any methods defined in your JS files to begin execution       
			} else {
				console.log("dynamic html not loaded..");
				window.setTimeout(waitForLoad, 500);
			}
		 };

		 window.setTimeout(waitForLoad, 500);   
	}
    
	function clearGraph4() {
		d3.select(chart1).selectAll("*").remove();
		d3.select(chart2).selectAll("*").remove();
		d3.select(chart3).selectAll("*").remove();
		d3.select(chart4).selectAll("*").remove();
	}

	function clearGraph2() {
		d3.select(chart5).selectAll("*").remove();
		d3.select(chart6).selectAll("*").remove();
	}


	function drawAfterLoad() {

		switch (n) {

			case 1:
				clearGraph4();
				app1 = new LineChart1(chart1, title1);
				app2 = new BarChart1(chart2, title2);
				app3 = new BarChart4(chart3, title3);
				app4 = new LineChart2(chart4, title4);
				break;

			case 2:
				clearGraph4();
				app1 = new BulletChart1(chart1, "app1", title1);
				app2 = new BulletChart2(chart2, "app2", title2);
				app3 = new BarChart2(chart3, title3);
				app4 = new BarChart3(chart4, title4);
				break;

			case 3:
				clearGraph2();
//				app1 = new PieChart1(chart5, title1);
				app2 = new AgeDistributionChart(chart6, title2);
				break;
			
            // WEATHER
			case 4:
				clearGraph4();
				app1 = new LineChart5(chart1, title1);
				app2 = new LineChart2(chart2, title2);
                app3 = new LineChart4(chart3, "app3", title3);
				app4 = new LineChart3(chart4, "app4", title4);
				break;
            
            case 5:
                clearGraph4();
                app1 = new LineChart6(chart1,"app1",title1);
                break;

		}
	}


	function resetFilters() {
        filters.resetFilters();

		// does not work if filter is dynamic html content
		// better: edit global variables
		// TODO: make filters consistent again - this version doesn't work at the moment
		
		/* 
        DOC.getElementById("fgm").checked = false;
        DOC.getElementById("fgm").disabled = false;

        DOC.getElementById("fgf").checked = false;
        DOC.getElementById("fgf").disabled = false;

        DOC.getElementById("fgu").checked = false;
        DOC.getElementById("fgu").disabled = false;

        DOC.getElementById("fus").checked = false;
        DOC.getElementById("fus").disabled = false;

        DOC.getElementById("fuc").checked = false;
        DOC.getElementById("fuc").disabled = false;
		*/
    }
}
