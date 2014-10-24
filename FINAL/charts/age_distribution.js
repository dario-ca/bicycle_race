function AgeDistributionChart(tag, titletag) {

    this.tag = tag;
    
    this.margin = {
        top: 0,
        right: 30,
        bottom: 33,
        left: 60
    };
    
    d3.select(titletag).text("Number of rides per age group");
    this.svg = d3.select(this.tag).append("svg").attr("class", "bar_chart_svg");
    
    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;
    
    this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

    // Day = 0 is monday
    // Day = 6 is sunday
	this.labels = [];
    this.values = [];
    this.counter = 0;
    // this.getBikesForallDays(null, null, null);

    // List of all the stations
    this.stations = [];
	station = null;
	gender = null;
	usertype = null;
    this.callBack_getBikesPerDay(this, station, gender, usertype);
}

AgeDistributionChart.prototype.draw = function () {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("rect").remove();
    d3.select(this.tag).selectAll("#tip").remove();


	// Fill dates with no entries with 0
	var arraysize = parseInt(this.labels[this.labels.length-1]) - parseInt(this.labels[0]);
	var invxvalues = new Array(arraysize);
	var xvalues = new Array(arraysize);
	var invyvalues = new Array(arraysize);
	var yvalues = new Array(arraysize);

	for(i=0, k=0; i<arraysize; ++i, ++k) {

		if(i === 0 || (parseInt(this.labels[k]) === (parseInt(invxvalues[i-1])+1)) ) {
			invxvalues[i] = this.labels[k]; // 2013 - parseInt(this.labels[k]);
			invyvalues[i] = this.values[k];
		} else {
			invxvalues[i] = parseInt(invxvalues[i-1]) + 1;
			invyvalues[i] = 0;
			--k;
		}
	}

	for(i=0; i<arraysize; ++i) {
		xvalues[i] = invxvalues[arraysize-1-i];
		yvalues[i] = invyvalues[arraysize-1-i];
	}
    
	var margin = this.margin;
    var width = this.canvasWidth -margin.left - margin.right,
        height = this.canvasHeight - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    
    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xvalues);
    
	var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
		.tickFormat(function (d){return (2013-d);})
        .tickValues(xScale.domain().filter(function (d, i) {
            return !(i % 4);
        }))
        .tickSize(3)
        .tickPadding(7);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(function (d) {
            if (d >= 1000)
                return (d / 1000).toFixed(1) + "K";
            return d;
        });


	var ageoffset = 2013-parseInt(xvalues[0]);
    var tip = d3.tip()
        .attr('id', 'tip')
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d,i) {
            return "<strong>Number of rides at age " + (i+ageoffset) + ":</strong> <span style='color:orange'>" + dotSeparator(d) + "</span>";
        });

    var svg = this.svg;

    svg.call(tip);


    var padding = width / xvalues.length - 2;
    x.domain(xvalues);
    y.domain([0, max(yvalues) * 1.1]);

    // X AXIS
    svg.append("g")
        .attr("class", "x axis color_axis")
        .attr("transform", "translate("+margin.left+"," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .style("text-anchor", "end");

	svg.append("text")
        .attr("x", width)
        .attr("y", height)
        .attr("dy", "-.8em")
		.attr("font-size","3vh")
        .text("Age");
    
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
		.attr("font-size","3vh")
        .text("Number of rides");

}


/*Load the result into a data structure*/
AgeDistributionChart.prototype.callBack_getBikesPerDay = function (context, station, gender, usertype) {
    // Empty the current values (this.values)
    context.labels = [];
	context.values = [];

    var parameters = "query=qXage";
    // station id: null means ALL
    if (station != null)
        parameters = parameters + "&station=" + station;
    
    // check gender
    if(gender != null)
        parameters = parameters + "&gender=" + gender;
    
    // check usertype
    if(usertype != null)
        parameters = parameters + "&usertype=" + usertype;

    // Load data
    d3.json("db_get.php?" + parameters, function (error, data) {
        data.forEach(function (d,i) {
            // NB: Don't use the push function! This method is called
            // asynchronous, so I prefer to directly store the value
            // in the corresponding index (monday is values[0] , tuesday is values[1]...)
			context.labels[i] = d.birthyear;
            context.values[i] = d.count; // parseFloat(d.count); // .toFixed(0);
        });

        // context.counter ++;
        // When all the 7 days have been loaded, draw the graph
        context.draw();
    });
}

/*Load stations [ID,NAME] into memory */
AgeDistributionChart.prototype.callBack_getStations = function (context) {
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
