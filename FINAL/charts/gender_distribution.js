function PieChart1(tag, titletag) {

    this.tag = tag;
    
	// TODO: edit	
	this.margin = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };
    
    d3.select(titletag).text("Distribution of Gender and Usertype");

    this.svg = d3.select(this.tag).append("svg"); // .attr("class", "bar_chart_svg");

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;
   
    this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

	this.gendername = [];
	this.gendercount = [];
	this.counter = 0;

	this.getGenderDistribution(null);

	this.callBack_getGenderDistribution(this);

}


PieChart1.prototype.getGenderDistribution = function(station) {
	this.callBack_getGenderDistribution(this,station)
}

	
	
// Loading result into data structure
PieChart1.prototype.callBack_getGenderDistribution = function(context,station) {

	context.gendername = [];
	context.gendercount = [];

	var parameters = "query=qXgender";
	
	if(station != null) {
		parameters = parameters + "&station=" + station;
	}

	// console.log("PARAMETERS: " + parameters);

	d3.json("db_get.php?" + parameters, function (error,data) {
		for(i=0; i<3; ++i) {
			context.gendername[i] = data[i].gender;
			context.gendercount[i] = data[i].count;
		}
		context.draw();
	});
	
}


PieChart1.prototype.draw = function() {
	
	console.log("\tDraw PieChart");

	var	gendername = this.gendername;
	var	gendercount = this.gendercount;


/*
var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
	*/

	var svg = this.svg;
	
	svg.selectAll("g").remove();
	svg.selectAll("path").remove(); // TODO: ???

	/*
	svg.append("rect")
		.attr("x","50").attr("y","50")
		.attr("width",this.gendercount[0]/1000).attr("height","50")

	svg.append("rect")
		.attr("x","50").attr("y","100")
		.attr("width",this.gendercount[1]/1000).attr("height","50")

	svg.append("rect")
		.attr("x","50").attr("y","150")
		.attr("width",this.gendercount[2]/1000).attr("height","50")
*/

/*
	var dataset = [{"label":gendername[0], "value":gendercount[0]}, 
				{"label":gendername[1], "value":gendercount[1]}, 
				{"label":gendername[2], "value":gendercount[2]}];
*/









var w = 3000, //width
h = 3000, //height
r = 500, //radius
color = d3.scale.category20c(); //builtin range of colors
 
data = [{"label":"one", "value":20},
{"label":"two", "value":50},
{"label":"three", "value":30}];
var vis = d3.select("#center")
.append("svg:svg") //create the SVG element inside the <body>
.data([data]) //associate our data with the document
.attr("width", w) //set the width and height of our visualization (these will be attributes of the <svg> tag
.attr("height", h)
.append("svg:g") //make a group to hold our pie chart
.attr("transform", "translate(" + r + "," + r + ")") //move the center of the pie chart from 0, 0 to radius, radius
 
var arc = d3.svg.arc() //this will create <path> elements for us using arc data
.outerRadius(r);
 
var pie = d3.layout.pie() //this will create arc data for us given a list of values
.value(function(d) { return d.value; }); //we must tell it out to access the value of each element in our data array
 
var arcs = vis.selectAll("g.slice") //this selects all <g> elements with class slice (there aren't any yet)
.data(pie) //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
.enter() //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
.append("svg:g") //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
.attr("class", "slice"); //allow us to style things in the slices (like text)
 
arcs.append("svg:path")
.attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
.attr("d", arc); //this creates the actual SVG path using the associated data (pie) with the arc drawing function
 
arcs.append("svg:text") //add a label to each slice
.attr("transform", function(d) { //set the label's origin to the center of the arc
//we have to make sure to set these before calling arc.centroid
d.innerRadius = 0;
d.outerRadius = r;
return "translate(" + arc.centroid(d) + ")"; //this gives us a pair of coordinates like [50, 50]
})
.attr("text-anchor", "middle") //center the text on it's origin
.text(function(d, i) { return data[i].label; }); //get the label from our original data array

// Rectangle
vis.append("rect")
.attr("x",50).attr("y",50)
.attr("width",200).attr("height",200)









	/* WORKING EXAMPLE
	 *
	 *
			var dataset1 = [ {"label":"M","value":20},
							{"label":"F","value":30},
							{"label":"U","value":50}];

			dataset2 = [gendercount[0],gendercount[1],gendercount[2]];
			
			var margin = this.margin;

			var w = this.canvasWidth - margin.left - margin.right;
			var h = this.canvasHeight - margin.top - margin.bottom;
			var outerRadius = Math.min(w,h)/2;
			var innerRadius = outerRadius/2;

			// var color = d3.scale.category10();
			// var color = d3.scale.category20c();
			var color = ['#0066cc','#cc66ff','#ffcc66'];

			var arc = d3.svg.arc()
							.innerRadius(innerRadius)
							.outerRadius(outerRadius);
			
			var pie = d3.layout.pie();
			
			//Set up groups
			var arcs = svg.selectAll("g.arc")
						  .data(pie(dataset2))
						  .enter()
						  .append("g")
						  .attr("class", "arc")
						  .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
			
			//Draw arc paths
			arcs.append("path")
			    .attr("fill", function(d, i) {
			    	return color[i];
			    })
			    .attr("d", arc);
			
			//Labels
			arcs.append("text")
			    .attr("transform", function(d) {
			    	return "translate(" + arc.centroid(d) + ")";
			    })
			    .attr("text-anchor", "middle")
			    .text(function(d) {
			    	return d.value;
			    });
*/
	// Gender Bar
/*
	var male = this.gendercount[0];
	var female = this.gendercount[1];
	var malefemale = male + female;

	svg.append("rect")
		.attr("x","50").attr("y","150")
		.attr("width",male/malefemale).attr("height","50")

	svg.append("rect")
		.attr("x",50 + male/malefemale).attr("y","150")
		.attr("width",female/malefemale).attr("height","50")
*/

/*
var vis = d3.select('#chart5')
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

*/	
	
	
	
	
	
	/*
var arc = d3.svg.arc()
    .outerRadius(r - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.count; });

svg.attr("width", w)
    .attr("height", h)
  .append("g")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");


var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", "black");
 */ 
  /*
  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.age; });
*/

	/*
	var chart = svg.models.pieChart()
		.x(function(d) { return d.label })
		.y(function(d) { return d.value })
		.showLabels(true);

	d3.select(tag)
		.datum(data)
		.transition().duration(340)
		.call(chart);
*/

	/*
	svg.append("svg:svg")
								.data([data])
								.attr("width", w).attr("height", h)
								.append("svg:g")
								.attr("transform", "translate(" + r + "," + r + ")");

					var pie = d3.layout.pie()
								.value(function(d){return d.value;});

					// declare an arc generator function
					var arc = d3.svg.arc().outerRadius(r);

					// select paths, use arc generator to draw
					var arcs = svg.selectAll("g.slice")
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
							*/


}
