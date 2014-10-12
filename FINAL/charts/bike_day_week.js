function BarChart1(tag, titletag) {

    this.tag = tag;
    
    this.margin = {
        top: 0,
        right: 30,
        bottom: 30,
        left: 60
    };
    
    d3.select(titletag).text("AVG Bikes out per DAY");
    this.svg = d3.select(this.tag).append("svg").attr("class", "bar_chart_svg");
    
    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;
    
    this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

    // Day = 0 is monday
    // Day = 6 is sunday
    this.values = [];
    this.counter = 0;
    this.getBikesForallDays(0, null, null);

    // List of all the stations
    this.stations = [];
    this.callBack_getStations(this);
}

BarChart1.prototype.draw = function () {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("rect").remove();
    d3.select(this.tag).selectAll("#tip").remove();

    var margin = this.margin;
    var width = this.canvasWidth -margin.left - margin.right,
        height = this.canvasHeight - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(function (d) {
            if (d >= 1000)
                return (d / 1000).toFixed(1) + "K";
            return d;
        });

    var tip = d3.tip()
        .attr('id', 'tip')
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>AVG bikes out:</strong> <span style='color:orange'>" + dotSeparator(d) + "</span>";
        });

    var svg = this.svg;

    svg.call(tip);

    var xvalues = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var yvalues = this.values;

    var padding = width / xvalues.length - 2;
    x.domain(xvalues);
    y.domain([0, max(yvalues) * 1.1]);

    // X AXIS
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+margin.left+"," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");
    
    // BARS
    svg.selectAll(".bar")
        .data(yvalues)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d, i) {
            return i * padding;
        })
        .attr("width", x.rangeBand())
        .attr("transform", "translate (" + (margin.left + 10) + ", -2)")
        .attr("y", function (d, i) {
            return y(d);
        })
        .attr("height", function (d, i) {
            return height - y(d);
        })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    
    // Y AXIS
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform","translate("+margin.left+",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("AVG Bikes Out");

}

// For all days...
BarChart1.prototype.getBikesForallDays = function (station, gender, usertype) {
    this.counter = 0;
    for (day = 0; day < 7; day++)
        this.callBack_getBikesPerDay(this, day, station, gender, usertype);
}

/*Load the result into a data structure*/
BarChart1.prototype.callBack_getBikesPerDay = function (context, day, station, gender, usertype) {
    // Empty the current values (this.values)
    context.values = [];

    var parameters = "query=q2a&weekday=" + day;
    // station id: 0 means ALL
    if (station != 0)
        parameters = parameters + "&station=" + station;
    
    // check gender
    if(gender != null)
        parameters = parameters + "&gender=" + gender;
    
    // check usertype
    if(usertype != null)
        parameters = parameters + "&usertype=" + usertype;

    // Load data
    d3.json("db_get.php?" + parameters, function (error, data) {
        data.forEach(function (d) {
            // NB: Don't use the push function! This method is called
            // asynchronous, so I prefer to directly store the value
            // in the corresponding index (monday is values[0] , tuesday is values[1]...)
            context.values[day] = parseFloat(d.bikes).toFixed(0);
        });

        context.counter ++;
        // When all the 7 days have been loaded, draw the graph
        if (context.counter == 7)
            context.draw();
    });
}

/*Load stations [ID,NAME] into memory */
BarChart1.prototype.callBack_getStations = function (context) {
    var dropdown = d3.select("#stations_dropdown1");
    d3.csv("data/stations.csv", function (error, data) {
        data.forEach(function (d) {
            context.stations.push([d.station_id, d.station_name]);
            dropdown.append("option")
                .attr("value", d.station_id)
                .text("Station " + d.station_id + ": " + d.station_name);
        });
    });
}

//==================================================
// UTILS
//==================================================

function max(array) {
    return Math.max.apply(Math, array);
}

function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}