function LineChart3(tag, appname, titletag) {

    this.tag = tag;

    this.temp = 'temp';
    this.prec = 'prec';
    
    this.margin = {
        top: 10,
        right: 30,
        bottom: 40,
        left: 60
    };

    d3.select(titletag).text("Weather during the YEAR");
    d3.select(tag).append("button").attr("onclick", appname + ".draw('temp')").style("margin-left","30%").text("Temperature");
    d3.select(tag).append("button").attr("onclick", appname + ".draw('prec')").style("margin-left","10%").text("Precipitations");
    
    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;

    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
    //.attr("preserveAspectRatio", "xMinYMin meet");

    //day of the year
    this.xValues = [];
    //number of bikes
    this.yValuesTemp = [];
    this.yValuesPrec = [];
    
    this.setOption();

}

LineChart3.prototype.setOption = function () {
    this.callBack_getData(this);
}

LineChart3.prototype.callBack_getData = function (context) {
    
    context.xValues = [];
    context.yValuesTemp = [];

    d3.csv("data/weather.csv", function (error, data) {
        
        var sumTemp = 0;
        var sumPrec = 0;
        
        data.forEach(function (d, i) {
            sumTemp += parseFloat(d.temperatureF);
            if(d.precipitationIn != "N/A")
                sumPrec += parseFloat(d.precipitationIn);
            // Print on the chart only the average temperature of each day, and the average rain
            if ((i+1) % 24 == 0) {
                var date = new Date(d.datetime);
                context.xValues[context.xValues.length] = date;
                context.yValuesTemp[context.yValuesTemp.length] = sumTemp/24;
                context.yValuesPrec[context.yValuesPrec.length] = sumPrec/24;
                sumTemp = 0;
                sumPrec = 0;
            }
        });
        context.draw('temp');
    });
}


LineChart3.prototype.draw = function (whatToDraw) {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();
    d3.select(this.tag).selectAll("rect").remove();

    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    var xValues = this.xValues;
    var yValues ;
    var yLabel;
    var maxLabel;
    
    if(whatToDraw == this.temp){
        yValues = this.yValuesTemp;
        yLabel = "Temperature [F]";
        maxLabel = max(yValues) * 1.1;
    }
    else{
        yValues = this.yValuesPrec;
        yLabel = "Precipitation [In]";
        maxLabel = 0.105
    }
    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xValues);

    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, maxLabel]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickValues(xScale.domain().filter(function (d, i) {
            return !(i % 12);
        }))
        .tickSize(3)
        .tickPadding(7)
        .tickFormat(function (d) {
            return getXLabel(d);
        });

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(function (d) {
            if(d >= 0.001 && d <= 0.999)
                return (d*1000)+"m";
            return d;
        })
        .tickSize(3)
        .tickPadding(7);

    var svg = this.svg;
    
    // HOLIDAY 1
    svg.append("rect")
        .attr("x", parseFloat(margin.left))
        .attr("y", 0)
        .attr("width", width / 2.7)
        .attr("height", height)
        .style('opacity', 0.15)
        .style('fill', '#00ceff');

    // HOLIDAY 2
    svg.append("rect")
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
        .text(yLabel);

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

function getXLabel(date) {
    var monthNames = [
                    "Jan", "Feb", "Mar",
                    "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep",
                    "Oct", "Nov", "Dec"
                    ];
    var monthNumber = date.getMonth();
    var day = date.getDate();
    
    return monthNames[monthNumber] + " "+day;
}