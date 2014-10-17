function PieChart1(tag, titletag) {

	// Draw image to tag
	
    this.tag = tag;
    this.margin = {
        top: 0,
        right: 30,
        bottom: 38,
        left: 60
    };

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;


	// Write title to titletag
    d3.select(titletag).text("Gender distribution");
    this.svg = d3.select(this.tag)
        .append("svg")
        // .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
        //.attr("preserveAspectRatio", "xMinYMin meet");

    //hours of the day
    this.xValues = [];
    //number of bikes
    this.yValues = [];
    this.setOption(null,null,null);
}

PieChart1.prototype.setOption = function (station, gender, usertype) {
    this.callBack_getData(this, station, usertype);
}

PieChart1.prototype.callBack_getData = function (context, station, usertype) {

    context.xValue = [];
    context.yValue = [];

    var parameters = "query=q3";

	// add station filter
    if (station != null)
        parameters = parameters + "&station=" + station;
    
    // add usertype filter
    if(usertype != null)
        parameters = parameters + "&usertype=" + usertype;

    console.log(parameters);
	// start query
    d3.json("db_get.php?" + parameters, function (error, data) {
		/*
        data.forEach(function (d) {
            context.xValues[context.xValues.length] = d.gender;
            context.yValues[context.yValues.length] = d.num_bikes;
        });
		*/

		// Dummy
		context.xValues[0] = 'M';
		context.xValues[1] = 'F';
		context.xValues[2] = 'U';
		context.yValues[0] = 50;
		context.yValues[1] = 30;
		context.yValues[2] = 20;

        context.draw();
    });
}

PieChart1.prototype.draw = function () {

	// Clear canvas
    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();

	// Set parameters
    var margin = this.margin;

    var xValues = this.xValues;
    var yValues = this.yValues;

	console.log('X Values = ' + xValues);
	console.log('Y Values = ' + yValues);
	
var w = this.canvasWidth - margin.left - margin.right;
var h = this.canvasHeight - margin.top - margin.bottom;
var r = h/2;
var color = d3.scale.category20c();


// create data array
var data = [{"label":xValues[0], "value":yValues[0]}, 
		          {"label":xValues[1], "value":yValues[1]}, 
		          {"label":xValues[2], "value":yValues[2]}];

var vis = d3.select('#chart1')
			.append("svg:svg")
			.data([data])
			.attr("width", w).attr("height", h)
			.append("svg:g")
			.attr("transform", "translate(" + r + "," + r + ")");

var pie = d3.layout.pie()
			.value(function(d){return d.value;});

// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);

// select paths, use arc generator to draw
var arcs = vis.selectAll("g.slice")
				.data(pie).enter()
				.append("svg:g")
				.attr("class", "slice");

arcs.append("svg:path")
    .attr("fill", function(d, i){
        return color(i);
    })
    .attr("d", function (d) {
        console.log(arc(d)); // log to console
        return arc(d);
    });

// add the text
arcs.append("svg:text").attr("transform", function(d){
			d.innerRadius = 0;
			d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return data[i].label;}
		);







	// Draw PieChart here!!!

	//////////////////////////////////////////////////////////////////////
	/* 
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
        .tickPadding(7);
    
    var zoom = d3.behavior.zoom()
        //.x(xScale)
        .y(yScale)
        .scaleExtent([1, 10])
        .on("zoom", zoomed);	

    var svg = this.svg;
    
    svg.call(zoom);
    
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
	*/
	//////////////////////////////////////////////////////////////////////
    
	
	/*
    // Vertical Lines
    gx.selectAll("g")
        .classed("xminor", true)
        .select("line")
        .attr("y2", function (d, i) {
            return -height + yScale(yValues[i]);
        });
    */
/*
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
        .text("AVG Bikes Out");
 */   
    function zoomed() {
        //svg.select(".x.axis").call(xAxis);
		//
		/*
        svg.select(".x.axis")
            .call(xAxis.scale(xScale.rangePoints([0, width * d3.event.scale],.1 * d3.event.scale)));
        
        svg.select(".y.axis").call(yAxis);   
        
        svg.selectAll(".chart.line").attr('d', line)
            //.attr("transform", "translate(" + d3.event.translate[0]+",0)");
        
        gy.selectAll("g")
            .classed("yminor", true)
            .select("line")
            .attr("x2", function (d, i) {
            return width;
        });
        
        gx.selectAll("text")
            .attr("transform","rotate(-35)")
            .style("text-anchor", "end");
       */ 
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


function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function max(array) {
    return Math.max.apply(Math, array);
}
