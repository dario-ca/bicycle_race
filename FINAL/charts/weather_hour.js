function LineChart4(tag, appname, titletag) {

    this.tag = tag;
    this.titletag = titletag;

    this.temp = 'temp';
    this.prec = 'prec';

    this.margin = {
        top: 10,
        right: 30,
        bottom: 40,
        left: 60
    };

    d3.select(titletag).text("Weather during the DAY");
    d3.select(tag).append("button").attr("onclick", appname + ".draw('temp')").style("margin-left", "30%").text("Temperature");
    d3.select(tag).append("button").attr("onclick", appname + ".draw('prec')").style("margin-left", "10%").text("Precipitations");

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;

    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
    //.attr("preserveAspectRatio", "xMinYMin meet");

    //hours of the day
    this.xValues = [];
    //number of bikes
    this.yValuesTemp = [];
    this.yValuesPrec = [];

    //Sunset and sunrise dates
    this.sunsetDate = null;
    this.sunriseDate = null;

    this.setOption(null);
}

LineChart4.prototype.setOption = function (date) {
    this.xValues = [];
    this.yValuesTemp = [];
    this.yValuesPrec = [];
    this.callBack_getData(this, date);
}

LineChart4.prototype.callBack_getData = function (context, date) {
    if (date == null) {
        this.resetSvg();
        
        d3.select(this.tag).select("svg")
            .append("text")
            .attr("x", this.canvasWidth / 3 + 15)
            .attr("y", this.canvasHeight / 2)
            .text("Pick a day")
            .attr("fill", "steelblue")
            .attr("font-size", "5vh");
        return;
    }

    var dParam = new Date(date);
    context.sunsetDate = SunCalc.getTimes(dParam, 41.83, -87.68).sunsetStart;
    context.sunriseDate = SunCalc.getTimes(dParam, 41.83, -87.68).sunriseEnd;
    
    context.xValues = [];
    context.yValues = [];
    d3.select(this.titletag).text("Weather on " + dayName(dParam) + " " + (dParam.getMonth() + 1) + "/" + dParam.getDate() + "/" + dParam.getFullYear());

    d3.csv("data/weather.csv", function (error, data) {

        var dayData = [];

        data.forEach(function (d, i) {
            var dCurrent = new Date(d.datetime);
            if (dParam.getMonth() == dCurrent.getMonth() && dParam.getDate() == dCurrent.getDate()) {
                context.xValues[context.xValues.length] = dCurrent.getHours();
                context.yValuesTemp[context.yValuesTemp.length] = parseFloat(d.temperatureF);
                if (d.precipitationIn == "N/A")
                    context.yValuesPrec[context.yValuesPrec.length] = 0;
                else
                    context.yValuesPrec[context.yValuesPrec.length] = parseFloat(d.precipitationIn);
            }
        });

        context.draw('temp');
    });
}

LineChart4.prototype.draw = function (whatToDraw) {

    this.resetSvg();

    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;
    
    var sunsetDate = this.sunsetDate;
    var sunriseDate = this.sunriseDate;

    var xValues = this.xValues;
    var yValues;
    var yLabel;
    var maxVal;

    if (whatToDraw == this.temp) {
        yValues = this.yValuesTemp;
        yLabel = "Temperature [F]";
        maxVal = 96;
    } else {
        yValues = this.yValuesPrec;
        yLabel = "Precipitation [In]";
        maxVal = max(yValues) * 1.1;
    }

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xValues);

    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, maxVal]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickValues(xScale.domain().filter(function (d, i) {
            return !(i % 2);
        }))
        .tickSize(3)
        .tickPadding(7)
        .tickFormat(function (d) {
            return hourAMPM(d);
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(function (d) {
            if (d >= 0.001 && d <= 0.999)
                return (d * 1000) + "m";
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

    // Lunch
    svg.append("rect")
        .attr("id", "lunch")
        .attr("x", parseFloat(margin.left + width / 2))
        .attr("y", 0)
        .attr("width", width / 9)
        .attr("height", height)
        .style('opacity', 0.15)
        .style('fill', '#23aa17');

    // Dinner
    svg.append("rect")
        .attr("id", "dinner")
        .attr("x", parseFloat(margin.left + width / 1.3))
        .attr("y", 0)
        .attr("width", width / 9)
        .attr("height", height)
        .style('opacity', 0.15)
        .style('fill', '#23aa17');

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
    
    
    var sunriseX = margin.left + getXRelativePosition(sunriseDate,width);
    var sunsetX = margin.left + getXRelativePosition(sunsetDate,width);
    // SUNRISE LINE
    svg.append("line")
        .attr("x1", sunriseX)
        .attr("x2", sunriseX)
        .attr("y1", height*0.03)
        .attr("y2", height)
        .attr("stroke","gray");
    
    // SUNSET LINE
    svg.append("line")
        .attr("x1", sunsetX)
        .attr("x2", sunsetX)
        .attr("y1", height*0.03)
        .attr("y2", height)
        .attr("stroke","gray");
    
    /*
    svg.append("circle")
        .attr("cx", (sunriseX+margin.left) / 2)
        .attr("cy", height*0.1)
        .attr("r", height*0.07)
        .attr("fill","#474b65");
    
    svg.append("circle")
        .attr("cx", (sunriseX+sunsetX) / 2)
        .attr("cy", height*0.1)
        .attr("r", height*0.07)
        .attr("fill","#e3b13c");
    
    svg.append("circle")
        .attr("cx", (sunsetX+width+margin.left) / 2)
        .attr("cy", height*0.1)
        .attr("r", height*0.07)
        .attr("fill","#474b65");
    */
    
    /*
    <line x1="5" y1="5" x2="40" y2="40" stroke="gray" stroke-width="5"  />
    <circle cx="25" cy="25" r="25" fill="purple" />
    */
    /*
    // Vertical Lines
    gx.selectAll("g")
        .classed("xminor", true)
        .select("line")
        .attr("y2", function (d, i) {
            return -height + ...;
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
        .text(yLabel);


    //zoom function
    function zoomed() {
        //svg.select(".x.axis").call(xAxis);
        svg.select(".x.axis")
            .call(xAxis.scale(xScale.rangePoints([0, width * d3.event.scale], .001 * d3.event.scale)));


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
            .attr("transform", "rotate(-35)")
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

LineChart4.prototype.resetSvg = function () {
    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();
    d3.select(this.tag).selectAll("text").remove();
    d3.select(this.tag).selectAll("rect").remove();
    d3.select(this.tag).selectAll("line").remove();
    d3.select(this.tag).selectAll("circle").remove();
}

//////////////////////////////////////////UTILS
function hourAMPM(hour) {
    if (hour == 0)
        return "12AM";
    if (hour >= 1 && hour <= 11)
        return hour + "AM";
    if (hour == 12)
        return "12PM";
    if (hour >= 13 && hour <= 23)
        return (hour - 12) + "PM";
}

function dayName(date) {
    var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
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

function getXRelativePosition(date,width){
    var oneMinutePixels = width / (23*60);
    var dateMinutes = (date.getHours() * 60) + date.getMinutes();
    return oneMinutePixels * dateMinutes;
}