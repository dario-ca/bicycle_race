function Line_chart(tag){
    
    this.tag=tag;

    this.margin = {top: 30, right: 20, bottom: 20, left: 100};
    this.canvasWidth=800;
    this.canvasHeight=400;
    
    this.svg=d3.select(this.tag)
                .append("svg")
                .attr("class","line_chart_svg")
                .attr("viewBox","0 0 "+this.canvasWidth+" "+this.canvasHeight)
                //.attr("viewBox","0 0 100 100")
                .attr("preserveAspectRatio","xMinYMin meet");

    //hours of the day
    this.xValues=[];
    //number of bikes
    this.yValues=[];

    this.callBack_getData(this);

}

Line_chart.prototype.callBack_getData = function(context){
    
    context.xValues=[];
    context.yValues=[];
    var parameters="query=q3c";
    d3.json("db_get.php?"+parameters, function(error, data) {
        data.forEach(function(d){
            context.xValues.push(d.hour);
            context.yValues.push(d.num_bikes);
        });
        console.log(context.xValues);
        console.log(context.yValues);
        context.draw();
    });
}

Line_chart.prototype.draw = function(){

    console.log('DRAW FUNCTION');
    
    //d3.select(this.tag).remove();

    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    var xValues = this.xValues;
    var yValues = this.yValues;

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1).domain(xValues);

    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, max(yValues)]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(function(d){
            if(d >= 10000)
                return (d/1000).toFixed(0)+"k";
            if(d >= 1000)
                return (d/1000).toFixed(1)+"k";
            return d;
        });;

    var svg=this.svg;

    svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var padding = width / xValues.length;

    svg.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate("+margin.left+"," + height + ")")
          .call(xAxis);

    svg.append("g")
          .attr("class", "yAxis")
          .attr("transform", "translate("+ margin.left+ ",0)")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Bikes Out");


    var line = d3.svg.line()
                .x(function(d,i) { return xScale(i); })
                .y(function(d,i) { return yScale(yValues[i]);});

    svg.append("path")
      .datum(yValues)
      .attr("class", "line")
      .attr("d", line).attr("transform", "translate("+ parseFloat(margin.left+15)+ ",0)");
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