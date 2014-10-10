function BarChart3(tag, titletag) {

    this.tag = tag;
    this.margin = {
        top: 0,
        right: 30,
        bottom: 30,
        left: 60
    };
    
    d3.select(titletag).text("Number of trips by rides time");
    this.svg = d3.select(this.tag).append("svg").attr("class", "bar_chart_svg");

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;
    
    this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

    this.values = [];
    this.counter = 0;
    this.getBikesFarallIntervals();
}

BarChart3.prototype.draw = function () {

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
            if (d >= 1000)
                return (d / 1000).toFixed(0) + "K";
            return d;
        });

    var tip = d3.tip()
        .attr('id', 'tip')
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return "<strong>Number of Trips:</strong> <span style='color:orange'>" + dotSeparator(d) + "</span>";
        });

    var svg = this.svg;
    svg.call(tip);

    var xvalues = ["0-5", "5-10", "10-15", "15-20", "20-25", "25-30", "30-60", ">60 min"];
    var yvalues = this.values;

    var padding = width / xvalues.length - 2;
    x.domain(xvalues);
    y.domain([0, max(yvalues) * 1.1]);

    // X AXIS
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(20)");

    // BARS
    svg.selectAll(".bar")
        .data(yvalues)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d, i) {
            return i * padding;
        })
        .attr("width", x.rangeBand())
        .attr("transform", "translate (" + (margin.left + 10) + ",0)")
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
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Trips");

}

// For all intervals...
BarChart3.prototype.getBikesFarallIntervals = function () {
    this.counter = 0;
    // First 5 intervals up to 30 mins
    for (minutes = 0, index = 0; minutes < 30; minutes += 5, index++)
        this.callBack_getBikesPerInterval(this, index, minutes, (minutes + 5) * 0.999);
    // Last 2 intervals
    this.callBack_getBikesPerInterval(this, index, minutes, 59.999);
    this.callBack_getBikesPerInterval(this, index + 1, 60, 1440);
}

/*Load the result into a data structure*/
BarChart3.prototype.callBack_getBikesPerInterval = function (context, index, min, max) {
    // Empty the current values (this.values)
    context.values = [];

    var parameters = "query=q7&min=" + min + "&max=" + max;

    // Load data
    d3.json("db_get.php?" + parameters, function (error, data) {
        data.forEach(function (d) {
            context.values[index] = d.bikes;
        });

        context.counter++;
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