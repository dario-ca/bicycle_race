function LineChart7(tag, titletag) {

    this.tag = tag;

    this.margin = {
        top: 0,
        right: 30,
        bottom: 70,
        left: 60
    };

    d3.select(titletag).text("AVG bikes out per DAY during the YEAR");
    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;

    var legendSvg = d3.select(this.tag)
        .append("svg");
    
    legendSvg.attr("class", "legend_chart_svg")
        .attr("viewBox", "0 0 100 100")
        .append("rect").attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style","stroke:black;stroke-width:5")
        .style('fill-opacity', 0.15)
        .style('fill', '#00ceff');
    
    d3.select(tag).append("p").attr("style","float: left").text("School Holidays");
    
    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
    //.attr("preserveAspectRatio", "xMinYMin meet");

    //day of the year
    this.xValues = [];
    //number of bikes
    this.yValues = [];

    this.setOption(null, null, null, 10 ,20);

}

LineChart7.prototype.setOption = function (station, gender, usertype, agemin, agemax) {
    this.callBack_getData(this, station, gender, usertype, agemin, agemax);
}

LineChart7.prototype.callBack_getData = function (context, station, gender, usertype, agemin, agemax) {

    context.xValues = [];
    context.yValues = [];
    var parameters;
    parameters = "query=q4";

    // station id: null means ALL
    if (station != null)
        parameters = parameters + "&station=" + station;

    // check gender
    if (gender != null)
        parameters = parameters + "&gender=" + gender;

    // check usertype
    if (usertype != null)
        parameters = parameters + "&usertype=" + usertype;
    
    if(agemin != null && agemax != null)
        parameters = parameters + "&agemin=" + parseInt(agemin) + "&agemax=" + parseInt(agemax);

    d3.json("db_get.php?" + parameters, function (error, data) {
        data.forEach(function (d, i) {
            context.xValues[context.xValues.length] = d.day_year;
            context.yValues[context.yValues.length] = d.bikes;
        });
        context.draw();
    });
}


LineChart7.prototype.draw = function () {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();
    d3.select(this.tag).selectAll("#hol1").remove();
    d3.select(this.tag).selectAll("#hol2").remove();

    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    var xValues = this.xValues;
    var yValues = this.yValues;

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xValues);

    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, max(yValues) * 1.1]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickValues(xScale.domain().filter(function (d, i) {
            return !(i % 12);
        }))
        .tickSize(3)
        .tickPadding(7);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(function (d) {
            if (d >= 10000)
                return (d / 1000).toFixed(0) + "k";
            if (d >= 1000)
                return (d / 1000).toFixed(1) + "k";
            else return d;
        })
        .tickSize(3)
        .tickPadding(7).ticks(7);

    var svg = this.svg;

    // HOLIDAY 1
    svg.append("rect")
        .attr("id","hol1")
        .attr("x", parseFloat(margin.left))
        .attr("y", 0)
        .attr("width", width / 2.7)
        .attr("height", height)
        .style('opacity', 0.15)
        .style('fill', '#00ceff');

    // HOLIDAY 2
    svg.append("rect")
        .attr("id","hol2")
        .attr("x", parseFloat(margin.left + width / 1.08))
        .attr("y", 0)
        .attr("width", width / 10)
        .attr("height", height)
        .style('opacity', 0.15)
        .style('fill', '#00ceff');


    //svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
        .x(function (d, i) {
            return xScale(xValues[i]);
        })
        .y(function (d, i) {
            return yScale(yValues[i]);
        });

    var padding = width / xValues.length;

    var gx = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + parseFloat(margin.left + 2) + "," + height + ")")
        .call(xAxis);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    /*
    // Vertical Lines
    gx.selectAll("g")
        .classed("xminor", true)
        .select("line")
        .attr("y2", function (d, i) {
            return -height + yScale(yValues[i * 12]);
        });
    */

    gx.selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

    gy.selectAll("g")
        .classed("yminor", true)
        .select("line")
        .attr("x2", function (d, i) {
            return width;
        });

    svg.append("path")
        .datum(yValues)
        .attr("class", "chart line")
        .attr("d", line).attr("transform", "translate(" + parseFloat(margin.left + 2) + ",0)");

    gy.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Bikes Out");

}

//////////////////////////////////////////UTILS
function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function max(array) {
    return Math.max.apply(Math, array);
}