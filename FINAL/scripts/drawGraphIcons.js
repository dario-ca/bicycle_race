// TODO: make work only with this function

var colorstring_normal = '#888';
var colorstring_dark = '#444';
var colorstring_hover = '#3db7e4';

function drawGraphIcon(id,iconname,functionhandle) {

	var icon = d3.select(id)
		.attr("width",100).attr("height",100);

	icon.append("rect")
		// .attr("class","icon")
		// .attr("class","color_tab")
		.style("stroke","black").style("fill",colorstring_normal)
		.attr("x",4).attr("y",4)
		.attr("rx",10).attr("ry",10)
		.attr("height", 92).attr("width", 92)
		.attr("viewBox",'0,0,100,100')
		.on("mouseover", function() {
			d3.select(this).style("fill",colorstring_hover)
		})
		.on("mouseout", function() {
			d3.select(this).style("fill",colorstring_normal);
		})
		.on("click", function() {
			functionhandle();
		});


  icon
		.append("svg:image")
		.attr("xlink:href", "img/" + iconname + ".svg")
		.attr("x",20)
		.attr("y",20)
		.attr("width", 60)
		.attr("height", 60)
		.on("mouseover", function() {
			d3.select(this).style("fill",colorstring_hover)
		})
		.on("mouseout", function() {
			d3.select(this).style("fill",colorstring_normal);
		})
		.on("click", function() {
			functionhandle();
		});

  /*
	icon.enter()
		.append("svg:img")
		.attr("xlink:href", "img/watch.svg")
		.attr("x", "60")
		.attr("y", "60")
		.attr("width", "20")
		.attr("height", "20");
*/

	// svg.image(icon, 5, 5, 100, 100, 'img/watch.svg')  

}




function drawDarkGraphIcon(id,iconname,functionhandle) {

	var icon = d3.select(id)
		.attr("width",100).attr("height",100);

	icon.append("rect")
		// .attr("class","icon")
		// .attr("class","color_tab")
		.style("stroke","black").style("fill",colorstring_dark)
		.attr("x",4).attr("y",4)
		.attr("rx",10).attr("ry",10)
		.attr("height", 92).attr("width", 92)
		.attr("viewBox",'0,0,100,100')
		.on("mouseover", function() {
			d3.select(this).style("fill",colorstring_hover)
		})
		.on("mouseout", function() {
			d3.select(this).style("fill",colorstring_dark);
		})
		.on("click", function() {
			functionhandle();
		});


  icon
		.append("svg:image")
		.attr("xlink:href", "img/" + iconname + ".svg")
		.attr("x",20)
		.attr("y",20)
		.attr("width", 60)
		.attr("height", 60)
		.on("mouseover", function() {
			d3.select(this).style("fill",colorstring_hover)
		})
		.on("mouseout", function() {
			d3.select(this).style("fill",colorstring_dark);
		})
		.on("click", function() {
			functionhandle();
		});

}
