function DemographicsChart(tag, titletag) {

	this.tag = tag;

	this.margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};

	this.stations = [];

	d3.select(titletag).text("Distribution of Gender and Usertype");

    this.svg = d3.select(this.tag).append("svg"); // .attr("class", "bar_chart_svg");

/*
   
    this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
*/

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;
	
	this.values = [];

	this.callBack_getDemographicsData(this);
}


DemographicsChart.prototype.draw = function () {

	var tag = this.tag;

	d3.select(tag).selectAll("g").remove();
	d3.select(tag).selectAll("path").remove();
	d3.select(tag).selectAll("rect").remove();
	d3.select(tag).selectAll("text").remove();
	d3.select(tag).selectAll("line").remove();
	d3.select(tag).selectAll("svg").remove();

	var data = this.values;
	
	var customer = data[0].count;
	var male = data[1].count;
	var female = data[2].count;

	var malefemale = male + female;
	
	var w = this.canvasWidth - this.margin.left - this.margin.right;
	var h = this.canvasHeight - this.margin.top - this.margin.bottom;
	var r = .6*Math.min(w,h)/2;

	var color = ["#ffcc66"/*yellow*/,"#0066cc"/*blue*/,"#cc66ff"/*pink*/];

	d3.select(tag).on("click", function() {
		zoomIn(this,5);
	});
	
	var svg = d3.select(tag).append("svg:svg")
		.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
		.data([data])
		.attr("width",w).attr("height",h)
		.append("svg:g")
		.attr("transform","translate(" + w/2 + "," + 1.2*r + ")")
    
	var arc = d3.svg.arc()
		.outerRadius(r)
		.innerRadius(.7*r);

	var pie = d3.layout.pie()
		.value(function(d) {
			return d.count;
		})
		.sort(null);

	var arcs = svg.selectAll("g.slice")
		.data(pie)
		.enter()
		.append("svg:g")
		.attr("class","slice");

	arcs.append("svg:path")
		.attr("fill", function(d,i) {
			return color[i];
		})
		.attr("d", arc)
		.attr("stroke-width","5px")
		.attr("class","color_bg_stroke");

	arcs.append("svg:text")
		.attr("transform", function(d){
			var c = arc.centroid(d);
			return "translate(" + (.6*c[0]) + "," + (.6*c[1]) + ")";
		})
		.attr("text-anchor", "middle")
		.text( function(d, i) {
			var label = thousandSeparator(data[i].count);
			return label;
		})
		.attr("font-size", "3vh")
		.attr("font-weight", "100")
		.attr("class","color_normal_stroke");

		var perc_subscriber = malefemale/(malefemale+customer);
		var perc_customer = customer/(malefemale+customer);

		svg.append("svg:text")
			.attr("transform", "translate(" + 1.1*r + "," + -.5*r + ")")
			.text("Customers")
			.attr("text-anchor","start")
			.attr("font-size","4vh")
			.attr("class","color_normal")
		
		svg.append("svg:text")
			.attr("transform", "translate(" + 1.1*r + "," + -0.2*r + ")")
			.text(Math.round(100*perc_customer) + "%")
			.attr("text-anchor","start")
			.attr("font-size","6vh")
			.attr("font-weight","600")
			.attr("class","color_normal")

		svg.append("svg:text")
			.attr("transform", "translate(" + -1.1*r + "," + -.5*r + ")")
			.text("Subscribers")
			.attr("text-anchor","end")
			.attr("font-size","4vh")
			.attr("class","color_normal")

		svg.append("svg:text")
			.attr("transform", "translate(" + -1.1*r + "," + -0.2*r + ")")
			.text(Math.round(100*perc_subscriber) + "%")
			.attr("text-anchor","end")
			.attr("font-size","6vh")
			.attr("font-weight","600")
			.attr("class","color_normal")
	
	// Gender Bar
	
	var gap = .01*r;

	var phi = (malefemale/(malefemale + customer) * 2*Math.PI);

	// console.log("Male: " + male + "\tFemale: " + female + "\tTotal: " + malefemale);

	svg.append("rect")
		.attr("fill",color[2])
		.attr("x",-1.1*r).attr("y",1.3*r)
		.attr("width",(2.2*r)*female/malefemale - gap).attr("height",.2*r)
		.attr("class","color_bg_stroke");

	svg.append("text")
		.attr("x",-1.1*r).attr("y",1.7*r)
		.attr("class","color_normal")
		.text('Female')
		.attr("text-anchor","start")
		.attr("font-size","30px");
	
	svg.append("svg:text")
		.attr("x",-1.1*r).attr("y",1.9*r)
		.text(Math.round(100*female/malefemale) + "%")
		.attr("text-anchor","start")
		.attr("font-size","4vh")
		.attr("font-weight","600")
		.attr("class","color_normal")
	
	svg.append("rect")
		.attr("fill",color[1])
		.attr("x",-1.1*r + (2.2*r)*female/malefemale + gap).attr("y",1.3*r)
		.attr("width",(2.2*r)*male/malefemale - gap).attr("height",.2*r)
		.attr("class","color_bg_stroke");

	svg.append("text")
		.attr("x",1.1*r).attr("y",1.7*r)
		.attr("class","color_normal")
		.text('Male')
		.attr("text-anchor","end")
		.attr("font-size","30px");
	
	svg.append("svg:text")
		.attr("x",1.1*r).attr("y",1.9*r)
		.text(Math.round(100*male/malefemale) + "%")
		.attr("text-anchor","end")
		.attr("font-size","4vh")
		.attr("font-weight","600")
		.attr("class","color_normal")

	// Connecting lines
	
	// Line 1
	svg.append("line")
		.attr("x1",0).attr("y1",-r)
		.attr("x2",0).attr("y2",-1.1*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");
	
	svg.append("line")
		.attr("x1",0).attr("y1",-1.1*r)
		.attr("x2",-w/2+.2*r).attr("y2",-1.1*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");

	svg.append("line")
		.attr("x1",-w/2+.2*r).attr("y1",-1.1*r)
		.attr("x2",-w/2+.2*r).attr("y2",1.4*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");
	
	svg.append("line")
		.attr("x1",-w/2+.2*r).attr("y1",1.4*r)
		.attr("x2",-1.1*r - gap).attr("y2",1.4*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");

	// Line 2
	
	svg.append("line")
		.attr("x1",-r*Math.sin(phi)).attr("y1",-r*Math.cos(phi))
		.attr("x2",-r*Math.sin(phi)).attr("y2",1.15*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");
	
	svg.append("line")
		.attr("x1",-r*Math.sin(phi)).attr("y1",1.15*r)
		.attr("x2",1.2*r).attr("y2",1.15*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");
	
	svg.append("line")
		.attr("x1",1.2*r).attr("y1",1.15*r)
		.attr("x2",1.2*r).attr("y2",1.4*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");
	
	svg.append("line")
		.attr("x1",1.2*r).attr("y1",1.4*r)
		.attr("x2",1.1*r + gap).attr("y2",1.4*r)
		.attr("stroke","#444")
		.attr("stroke-width",2)
		.attr("class","color_normal_stroke");

}


DemographicsChart.prototype.callBack_getDemographicsData = function(context) {

	context.values = [];

	var parameters = "query=qXgender";

	if ((this.stations != null) && (this.stations.length > 0)) {
		parameters = parameters + "&station=" + this.stations[this.stations.length-1].options.stationID;
		// TODO: queries for multiple stations
		/*
		for(i=1; i<this.stations.length; ++i) {
			parameters = parameters + "OR from_station_id=" + this.stations[i].options.stationID;
		}*/
	}

	d3.json("db_get.php?" + parameters, function (error, data) {

        data.forEach(function(d,i){
            d.count = parseInt(d.count);
        });

		context.values = data;
		context.draw();

	});
	
}

// UTILS

function thousandSeparator(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function zoomIn(context,n) {
//	console.log("ZOOOOOOOOOOOOOOOOOOOOMING IN");
//	document.getElementById('chartscheme').href='css/zoom/zoomin' + n + '.css';
	// context.draw();
}
