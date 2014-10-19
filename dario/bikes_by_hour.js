function Line_chart1(tag){
    
    this.tag=tag;
    this.margin = {top: 30, right: 20, bottom: 30, left: 100};
    this.canvasWidth=800;
    this.canvasHeight=400;
    
    this.svg=d3.select(this.tag)
                .append("svg")
                .attr("class","line_chart_svg")
                .attr("viewBox","0 0 "+this.canvasWidth+" "+this.canvasHeight)
                .attr("preserveAspectRatio","xMinYMin meet");

    d3.select(this.tag).append("input").attr("class", "inputnumber").attr("placeholder","Station id").attr("type", "number").attr("min", "1").attr("max", "5000").attr("onchange","this.add(this.value)");

    //hours of the day
    this.xValues=[];
    //number of bikes
    this.yValues=[];
    //all station to filter
    this.stations=[];
}

Line_chart1.prototype.setOption = function(station,gender,usertype){
    this.callBack_getData(this,station,gender,usertype);
}

Line_chart1.prototype.callBack_getData = function(context,station,gender,usertype){
    
    context.xValues=[];
    context.yValues=[];
    
    var parameters;
    parameters="query=q3";

    // station id: null means ALL
    if (station != null)
        parameters = parameters + "&station=" + station;
    
    // check gender
    if(gender != null)
        parameters = parameters + "&gender=" + gender;
    
    // check usertype
    if(usertype != null)
        parameters = parameters + "&usertype=" + usertype;

    d3.json("db_get.php?"+parameters, function(error, data) {
        data.forEach(function(d){
            context.xValues[context.xValues.length]=d.hour;
            context.yValues[context.yValues.length]=d.num_bikes;
        });
        console.log(context.xValues);
        console.log(context.yValues);
        context.draw();
    });
}

Line_chart1.prototype.draw = function(){

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();


    console.log('DRAW FUNCTION');
    
    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    var xValues = this.xValues;
    var yValues = this.yValues;

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xValues);

    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, max(yValues)*1.1]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickSize(2)
        .tickPadding(7);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickSize(2)
        .tickPadding(7);

    var svg=this.svg;

    //svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
                .x(function(d,i) { return xScale(xValues[i]); })
                .y(function(d,i) { return yScale(yValues[i]);});

    svg.append("path")
      .datum(yValues)
      .attr("class", "chart line")
      .attr("d", line).attr("transform", "translate("+ margin.left+ ",0)");

    var padding = width / xValues.length;

    var gx = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate("+margin.left+"," + height + ")")
          .call(xAxis);

    var gy = svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+ margin.left+ ",0)")
          .call(yAxis);

    gx.selectAll("text")
        .attr("transform","rotate(-40)")
        .style("text-anchor", "end");
    
    gx.selectAll("g")
            .classed("xminor", true)
            .select("line")
            .attr("y2",function(d,i){
                return -height+yScale(yValues[i]);
            });

    gy.selectAll("g")
            .classed("yminor", true)
            .select("line")
            .attr("x2",function(d,i){
                return width;
            });
    
    gy.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("AVG Bikes Out");

}

//////////////////////////////////////////UTILS
function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function max(array){
     return Math.max.apply( Math, array );
}