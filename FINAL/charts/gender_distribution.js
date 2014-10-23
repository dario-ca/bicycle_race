function DemographicsChart(tag, titletag) {

	this.tag = tag;

	this.margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	};

	d3.select(titletag).text("Distribution of Gender and Usertype");

/*
    this.svg = d3.select(this.tag).append("svg"); // .attr("class", "bar_chart_svg");

   
    this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
*/

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;
	
	this.values = [];

	station = null;

	this.callBack_getDemographicsData(this,station);
}


DemographicsChart.prototype.draw = function () {

	console.log("VALUES = " + this.values);

	var tag = this.tag;
	
	d3.select(this.tag).selectAll("g").remove();
	d3.select(this.tag).selectAll("rect").remove();
	d3.select(this.tag).selectAll("#tip").remove();

	
	


	var w = this.canvasWidth;
	var h = this.canvasHeight;
	var r = .6*Math.min(w,h)/2;

	color = ["#cc66ff"/*pink*/,"#0066cc"/*blue*/,"#ffcc66"/*yellow*/];

	var data = this.values;
	
	var svg = d3.select(tag).append("svg:svg").data([data])
		.attr("width",w).attr("height",h)
		.append("svg:g")
		.attr("transform","translate(" + w/2 + "," + 1.2*r + ")")
		.attr("viewBox", "0 0 " + w + " " + h);

	var arc = d3.svg.arc()
		.outerRadius(r)
		.innerRadius(.7*r);

	var pie = d3.layout.pie()
		.value(function(d) {
			return d.count;
		});

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
//			d.innerRadius = 0;
//			d.outerRadius = r;
			var c = arc.centroid(d);
			var sgn = (c[0] > 0 ? 1 : -1);
			return "translate(" + (c[0] + sgn*r/2) + "," + (c[1]) + ")";
		})
		.attr("text-anchor", "middle")
		.text( function(d, i) {
			var label = data[i].gender;
			if(label === 'Unknown') {
				label = 'Customer';
			}
			return label;
		})
		.attr("font-size", "30px")
		.attr("class","color_normal_stroke");




	// Gender Bar
	
	var gap = .01*r;

	var male = data[1].count;
	var female = data[0].count;
	var customer = data[2].count;

	var malefemale = male + female;

	var phi = (malefemale/(malefemale + customer) * 2*Math.PI);

	console.log("Male: " + male + "\tFemale: " + female + "\tTotal: " + malefemale);

	svg.append("rect")
		.attr("fill",color[0])
		.attr("x",-1.1*r).attr("y",1.3*r)
		.attr("width",(2.2*r)*female/malefemale - gap).attr("height",.2*r)
		.attr("class","color_bg_stroke");

	svg.append("text")
		.attr("x",-1.1*r).attr("y",1.3*r)
		.attr("class","color_text")
		.text('Female')
		.attr("font-size","30px");
	
	svg.append("rect")
		.attr("fill",color[1])
		.attr("x",-1.1*r + (2.2*r)*female/malefemale + gap).attr("y",1.3*r)
		.attr("width",(2.2*r)*male/malefemale - gap).attr("height",.2*r)
		.attr("class","color_bg_stroke");

	svg.append("text")
		.attr("x",1.1*r).attr("y",1.3*r)
		.attr("class","color_text")
		.text('Male')
		// .attr("text-align","right")
		.attr("font-size","30px");

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


DemographicsChart.prototype.callBack_getDemographicsData = function(context,station) {
	
	context.values = [];

	var parameters = "query=qXgender";

	if (station != null) {
		parameters = parameters + "&station=" + station;
	}

	d3.json("db_get.php?" + parameters, function (error, data) {


/*
        data.forEach(function(d,i){
            context.values[context.values.length]=d.count;
        });
*/

		// context.values = data;
		
		// console.log('DATA = ' + context.values);
	
		context.values = [{"gender":"Female", "count":1},
			{"gender":"Male", "count":2},
			{"gender":"Unknown", "count":4}];

        context.draw();

	});
	
}
