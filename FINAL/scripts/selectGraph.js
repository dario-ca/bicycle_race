function selectGraph(DOC, n) {

    console.log("\t- Draw Graph" + n);
    windowNumber = n;
    resetFilters();

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

    switch (n) {

    case 1:
        app1 = new LineChart1(chart1, title1);
        app2 = new BarChart1(chart2, title2);
        app3 = new BarChart4(chart3, title3);
        app4 = new LineChart2(chart4, title4);
        break;

    case 2: // DUMMY IMPLEMENTATION
        // TODO: please check
        app1 = new BulletChart1(chart1, "app1", title1);
        app2 = new BulletChart2(chart2, "app2", title2);
        app3 = new BarChart2(chart3, title3);
        app4 = new BarChart3(chart4, title4);
        break;

    }

    function resetFilters() {
        filters.resetFilters();

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
    }
}