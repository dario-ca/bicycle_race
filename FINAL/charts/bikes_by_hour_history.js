function LineChart1(tag, titletag) {

    this.tag = tag;
    this.titletag = titletag;
    this.margin = {
        top: 0,
        right: 30,
        bottom: 38,
        left: 60
    };

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;


    d3.select(titletag).text("AVG bikes out per HOUR during the DAY");
    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
        //.attr("preserveAspectRatio", "xMinYMin meet");

    //hours of the day
    this.xValues = [];
    //number of bikes
    this.yValues = [];
    this.setOption(null,null,null,null,null);
}

LineChart1.prototype.setOption = function (station, gender, usertype, agemin, agemax) {
    this.callBack_getData(this, station, gender, usertype, agemin, agemax);
}

LineChart1.prototype.callBack_getData = function (context, station, gender, usertype, agemin, agemax) {

    context.xValues = [];
    context.yValues = [];
    
    var parameters;
    parameters = "query=q3";

    // station id: null means ALL
    if (station != null)
        parameters = parameters + "&station=" + station;
    
    // check gender
    if(gender != null)
        parameters = parameters + "&gender=" + gender;
    
    // check usertype
    if(usertype != null)
        parameters = parameters + "&usertype=" + usertype;
    
    if(agemin != null && agemax != null)
        parameters = parameters + "&agemin=" + parseInt(agemin) + "&agemax=" + parseInt(agemax);

    d3.json("db_get.php?" + parameters, function (error, data) {
        data.forEach(function (d) {
            context.xValues[context.xValues.length] = d.hour;
            context.yValues[context.yValues.length] = d.num_bikes;
        });
        context.draw();
    });
}

LineChart1.prototype.draw = function () {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();

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
            return !(i % 2);
        }))
        .tickSize(3)
        .tickPadding(7);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(function(d){
            if (d >= 10000)
                return (d / 10000).toFixed(0) + "k";
            if (d >= 1000)
                return (d / 1000).toFixed(1) + "k";
            return d;
        })
        .tickSize(3)
        .tickPadding(7).ticks(7);
    
    /*
    //zoom variable
    var zoom = d3.behavior.zoom()
        //.x(xScale)
        .y(yScale)
        .scaleExtent([1, 2])
        .on("zoom", zoomed);*/	

    var svg = this.svg;
    
    //svg.call(zoom);
    
    //svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
        .x(function (d, i) {
            return xScale(xValues[i]);
        })
        .y(function (d, i) {
            return yScale(yValues[i]);
        });

    svg.append("path")
        .datum(yValues)
        .attr("class", "chart line")
        .attr("d", line)
        .attr("transform", "translate(" + margin.left + ",0)");

    var padding = width / xValues.length;

    var gx = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis);

    var gy = svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    gx.selectAll("text")
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end");

    /*
    // Vertical Lines
    gx.selectAll("g")
        .classed("xminor", true)
        .select("line")
        .attr("y2", function (d, i) {
            return -height + yScale(yValues[i]);
        });
    */

    gy.selectAll("g")
        .classed("yminor", true)
        .select("line")
        .attr("x2", function (d, i) {
            return width;
        });

    gy.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Bikes Out");
    
    
    //zoom function
    function zoomed() {
        //svg.select(".x.axis").call(xAxis);
        svg.select(".x.axis")
            .call(xAxis.scale(xScale.rangePoints([0, width * d3.event.scale],.001 * d3.event.scale)));
        
        
        svg.select(".y.axis").call(yAxis);   
        
        svg.selectAll(".chart.line").attr('d', line);
           // .attr("transform", "translate(" + zoom.translate()+")"+"scale(" + zoom.scale() + ")");
        
        gy.selectAll("g")
            .classed("yminor", true)
            .select("line")
            .attr("x2", function (d, i) {
            return width;
        });
        
        gx.selectAll("text")
            .attr("transform","rotate(-35)")
            .style("text-anchor", "end");
        
        /*gx.selectAll("text")
            .attr("transform", "translate("+zoom.translate()+")"+"scale("+zoom.scale()+")"+"rotate(-35)");*/
        
        /*gx.selectAll("text")        
            .attr("transform", "translate(" + d3.event.translate[0]+",0) rotate(-35)")
        .style("text-anchor", "end");*/
        
        /*d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xValues)*/
        
        /*svg.selectAll(".chart.line").attr('d', line)
            .attr("transform", "translate(" + d3.event.translate[0]+",0)")
            .call(xAxis.scale(xScale.rangePoints([0, width],0)));*/
    }

}

//////////////////////////////////////////UTILS
function dayName(date){
    var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return dayNames[date.getDay()];
}

function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function max(array) {
    return Math.max.apply(Math, array);
}