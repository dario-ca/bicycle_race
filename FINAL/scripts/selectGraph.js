function selectGraph(DOC,n) {
	
	console.log("\t- Draw Graph" + n);

	chart1 = DOC.getElementById("chart1");
    chart2 = DOC.getElementById("chart2");
    chart3 = DOC.getElementById("chart3");
    chart4 = DOC.getElementById("chart4");
	
	title1 = DOC.getElementById("titlebar1");
	title2 = DOC.getElementById("titlebar2");
	title3 = DOC.getElementById("titlebar3");
	title4 = DOC.getElementById("titlebar4");
    
    d3.select(chart1).selectAll("*").remove();
    d3.select(chart2).selectAll("*").remove();
    d3.select(chart3).selectAll("*").remove();
    d3.select(chart4).selectAll("*").remove();

	switch(n) {
		
		case 1:
			app1 = new LineChart1(chart1,title1);
			app2 = new BarChart1(chart2,title2);
			app3 = new BarChart4(chart3,title3);
			app4 = new LineChart2(chart4,title4);
			break;

		case 2: // DUMMY IMPLEMENTATION
			// TODO: please check
			app1 = new BarChart2(chart1,title1);
			app2 = new BarChart3(chart2,title2);
			app3 = new BulletChart1(chart3,"app3",title3);
			app4 = new BulletChart2(chart4,"app4",title4);
			break;
	
	}

}
