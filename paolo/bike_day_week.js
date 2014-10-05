function BarChart(tag) {
    
    this.tag = tag;
    this.margin = {top: 30, right: 30, bottom: 30, left: 60};
    
    this.svg = d3.select(this.tag).append("svg");

    this.canvasWidth = 400;
	this.canvasHeight = 300;
	this.svg.attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
    
    // Day = 0 is monday
    // Day = 6 is sunday
    this.values = [];
    for (day = 0 ; day < 7 ; day++)
        this.callBack_getTripsPerDay(this,day);
}

BarChart.prototype.draw = function(){
    
    d3.selectAll("g").remove();
    d3.selectAll("rect").remove();
    d3.selectAll("#tip").remove();
    
    var margin = this.margin;
    var width = this.canvasWidth,
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
        .tickFormat(function(d){return (d/1000).toFixed(0)+"K"});
    
    var tip = d3.tip()
        .attr('id','tip')
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Value:</strong> <span style='color:brown'>" + dotSeparator(d) + "</span>";
        });
    
    var svg = this.svg;
    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    svg.call(tip);
    
    var xvalues = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
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
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Number of Trips");
        
      svg.selectAll(".bar")
          .data(yvalues)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d,i) { return i * padding; })
          .attr("width", x.rangeBand())
          .attr("transform", "translate ("+ width/25 +",0)")
          .attr("y", function(d,i) { return y(d); })
          .attr("height", function(d,i) { return height - y(d); })
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

}

BarChart.prototype.callBack_getTripsPerDay = function(context, day){
    // Empty the current values (this.values)
    context.values = [];
    // Load data
	d3.json("db_get.php?query=q2a&weekday="+day, function(error, data) {
		    data.forEach(function(d) {
                // NB: Don't use the push function! This method is called
                // asynchronous, so I prefer to directly store the value
                // in the corresponding index (monday is values[0] , tuesday is values[1]...)
                context.values[day]= d.bikes;
	    	});
        
    // When all the 7 days have been loaded, draw the graph 
    if(context.values.length == 7)
        context.draw();
	});
}

//==================================================
// UTILS
//==================================================

function max(array){
     return Math.max.apply( Math, array );
}

function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}