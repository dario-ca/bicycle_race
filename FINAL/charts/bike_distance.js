function BarChart2(tag, titletag) {

    this.tag = tag;
    this.margin = {
        top: 0,
        right: 30,
        bottom: 40,
        left: 60
    };
    
    d3.select(titletag).text("Number of trips by rides DISTANCE");
    this.svg = d3.select(this.tag).append("svg").attr("class", "bar_chart_svg");

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;
    
    this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

    this.values = [];
    this.counter = 0;
    this.getBikesFarallIntervals(null,null,null,null,null);
}

BarChart2.prototype.draw = function () {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("rect").remove();
    d3.select(this.tag).selectAll("#tip").remove();

    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right,
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
            if (d >= 10000)
                return (d / 1000).toFixed(0) + "K";
            if (d >= 1000)
                return (d / 1000).toFixed(1) + "K";
            return d;
        }).ticks(7);

    var tip = d3.tip()
        .attr('id', 'tip')
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Number of Trips:</strong> <span style='color:orange'>" + dotSeparator(d) + "</span>";
        });

    var svg = this.svg;
    svg.call(tip);

    var xvalues = ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7", ">7 mi"];
    var yvalues = this.values;

    var padding = width / xvalues.length - 2;
    x.domain(xvalues);
    y.domain([0, max(yvalues) * 1.1]);

    /**    
      x.domain(data.map(function(d) { return d.letter; }));
      y.domain([0, d3.max(data, function(d) { return d.frequency; })]);
    **/
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+margin.left+"," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-35)")
        .style("text-anchor", "end");

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
    
     svg.append("g")
        .attr("class", "y axis")
     .attr("transform","translate("+margin.left+",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Trips");

}

// For all intervals...
BarChart2.prototype.getBikesFarallIntervals = function (station, gender, usertype, agemin, agemax) {
    this.counter = 0;
    // First 7 intervals
    for (miles = 0, index = 0; miles < 7; miles++, index++)
        this.callBack_getBikesPerInterval(this, index, miles, (miles + 1) * 0.999, station, gender, usertype, agemin, agemax);
    // Last one
    this.callBack_getBikesPerInterval(this, index, miles, 30000, station, gender, usertype, agemin, agemax);

}

/*Load the result into a data structure*/
BarChart2.prototype.callBack_getBikesPerInterval = function (context, index, min, max, station, gender, usertype, agemin, agemax) {
    // Empty the current values (this.values)
    context.values = [];

    var parameters = "query=q6&min=" + min + "&max=" + max;
    
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

    // Load data
    d3.json("db_get.php?" + parameters, function (error, data) {
        data.forEach(function (d) {
            context.values[index] = d.bikes;
        });

        context.counter ++;
        // When all the 7 intervals have been loaded, draw the graph 
        if (context.counter == 8)
            context.draw();
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