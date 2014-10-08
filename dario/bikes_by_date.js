function Line_chart2(tag){
    
    this.tag=tag;

    this.margin = {top: 30, right: 20, bottom: 30, left: 100};
    this.canvasWidth=800;
    this.canvasHeight=400;
    
    this.svg=d3.select(this.tag)
                .append("svg")
                .attr("class","line_chart_svg")
                .attr("viewBox","0 0 "+this.canvasWidth+" "+this.canvasHeight)
                .attr("preserveAspectRatio","xMinYMin meet");

    //day of the year
    this.xValues=[];
    //number of bikes
    this.yValues=[];

    this.callBack_getData(this);

}

Line_chart2.prototype.callBack_getData = function(context){
    
    context.xValues=[];
    context.yValues=[];
    var parameters="query=q4b";
    d3.json("db_get.php?"+parameters, function(error, data) {
        data.forEach(function(d,i){
            context.xValues[context.xValues.length]=d.day_year;
            context.yValues[context.yValues.length]=d.bikes;
        });
        console.log(context.xValues);
        console.log(context.yValues);
        context.draw();
    });
}


Line_chart2.prototype.draw = function(){

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
        .tickValues(xScale.domain().filter(function(d, i) { return !(i % 12); }))
        .tickSize(2)
        .tickPadding(7);

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(function(d){
            if(d!=0)
                return (d/1000).toFixed(0)+"k";
            else return d;
        })
        .tickSize(2)
        .tickPadding(7);

    var svg=this.svg;

    //svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
                .x(function(d,i) { return xScale(xValues[i]); })
                .y(function(d,i) { return yScale(yValues[i]);});

    svg.append("path")
      .datum(yValues)
      .attr("class", "line")
      .attr("d", line).attr("transform", "translate("+ parseFloat(margin.left+2)+ ",0)");

    var padding = width / xValues.length;

    var gx = svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate("+parseFloat(margin.left+2)+"," + height + ")")
          .call(xAxis);

    var gy = svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate("+ margin.left+ ",0)")
          .call(yAxis);
    
    gx.selectAll("g")
            .classed("xminor", true)
            .select("line")
            .attr("y2",function(d,i){
                    return -height+yScale(yValues[i*12]);
            });

    gx.selectAll("text")
        .attr("transform","rotate(-40)")
        .style("text-anchor", "end");

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
          .text("Bikes Out");

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