function LineChart6(tag,appname,titletag) {

    this.tag = tag;
    this.titletag = titletag;
    this.margin = {
        top: 0,
        right: 30,
        bottom: 38,
        left: 60
    };

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;

    d3.select(titletag).text("AVG bikes out per HOUR - Stations Comparison");
    
    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
    
    d3.select(this.tag).append("input")
        .attr("class", "inputnumber")
        .attr("placeholder", "station id")
        .attr("type", "number")
        .attr("min", "1").attr("max", "5000");
      //  .attr("onchange", appname + ".addStation(this.value)");
    
    

    //hours of the day
    this.all_xValues=[];
    //number of bikes
    this.all_yValues=[];
    //stations for comparisons
    this.stations=[];
    
    this.counter=0;
    
}

LineChart6.prototype.addStation = function (station_id){
    if(station_id!=""){
        this.stations[this.stations.length]=station_id;
        this.setOption(null,null,null);
    }
    
}
   
LineChart6.prototype.setOption = function (gender, usertype, date) {
    console.log("ENTRATO IN SET OPTION");
    this.callBack_getData(this, gender, usertype, date);
}

LineChart6.prototype.callBack_getData = function (context, gender, usertype, date) {
    
    context.counter=0;
    
    console.log("ENTRATO IN CALLBACK");
    console.log("num station: "+context.stations.length);
    if(context.stations.length==0){
        d3.select(this.tag).selectAll("g").remove();
        d3.select(this.tag).selectAll("path").remove();
    }
    d3.select(this.titletag).text("AVG bikes out per HOUR - Stations Comparison");
        
    var parameters;
    parameters = "query=q3";
    
    for(i=0;i<context.stations.length;i++){
        console.log("outer index "+i);
        // station id: null means ALL
        if (context.stations[i].options.stationID != null)
            parameters = parameters + "&station=" + context.stations[i].options.stationID;
        
        // check gender
        if(gender != null)
            parameters = parameters + "&gender=" + gender;

        // check usertype
        if(usertype != null)
            parameters = parameters + "&usertype=" + usertype;

        // check specific date
        if (date != null) {
            var d = new Date(date);
            parameters = parameters + "&day=" + d.getDate();
            parameters = parameters + "&month=" + (d.getMonth() + 1);

            d3.select(this.titletag)
                .text("Bikes out on "+dayName(d)+" "+(d.getMonth() + 1)+"/"+d.getDate()+"/"+d.getFullYear());
        }

        d3.json("db_get.php?" + parameters, function (error, data) {
            var xValues=[];
            var yValues=[];
            data.forEach(function (d) {
                yValues[yValues.length] = d.num_bikes;
                xValues[xValues.length] = d.hour;
            });
            context.all_yValues[context.all_yValues.length]=yValues;
            context.all_xValues[context.all_xValues.length]=xValues;
            if(context.counter==context.stations.length-1){
                console.log("lenght all_yValues: "+context.all_yValues.length);
                context.draw(context.all_xValues,context.all_yValues);
                context.all_xValues=[];
                context.all_yValues=[];
                console.log("stations ");console.log(context.stations);
                console.log("stations lenght "+context.stations.length);
            }
            context.counter++;
        });
    }
    
}

LineChart6.prototype.draw = function (all_xValues,all_yValues) {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();
    
    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(hourLabels());
    
    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, maxValue(all_yValues) * 1.1]);

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
    
    var svg = this.svg;
    
    var all_colors= give_colors();

    console.log("lenght yValues: "+all_yValues.length);
    console.log(all_yValues);
    
    for(ind=0; ind<all_yValues.length; ind++){
        console.log("color "+all_colors[ind]);
        console.log("index line: "+ind);
        var line = d3.svg.line()
            .x(function (d, i) {
                return xScale(all_xValues[ind][i]);
            })
            .y(function (d, i) {
                return yScale(all_yValues[ind][i]);
            });

        svg.append("path")
            .datum(all_yValues[ind])
            .attr("class", "chart line")
            .attr("d", line)
            .attr("transform", "translate(" + this.margin.left + ",0)")
            .style("stroke", function(d) { return all_colors[ind]; });
        
        svg.append("rect")
            .attr("x",width+margin.left+2)
            .attr("y","25")
            .attr("width","30")
            .attr("height","30")
            .style("fill","none")
            .style("stroke","white")
            .style("stroke-width","2vh");
        
    }
    
    var padding = width / all_xValues[0].length;
    
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
        .text("Bikes Out");
    

}

//////////////////////////////////////////UTILS
function dayName(date){
    var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return dayNames[date.getDay()];
}

function hourLabels(){
    var labels= ["12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM", "8PM", "9PM", "10PM", "11PM"];
    return labels;
}

function give_colors(){
    var allcolors=["#1f77b4","#ff7f0e","#98df8a","#bcbd22","#c7c7c7","#f7b6d2","#dbdb8d","#c5b0d5","#ffbb78","#aec7e8"];
    return allcolors;
}

function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function maxValue(arrayOfArray) {
    var max=0;
    for(i=0;i<arrayOfArray.length;i++){
        var temp = Math.max.apply(Math, arrayOfArray[i]);
        if(temp > max)
            max = temp;
    }
    return max;
}