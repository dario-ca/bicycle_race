function LineChart5(tag,appname,titletag) {

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

    console.log("LINECHART 5");
    d3.select(titletag).text("AVG bikes out per HOUR - Stations Comparison");
    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
        //.attr("preserveAspectRatio", "xMinYMin meet");
    
    d3.select("#chart2").append("input")
        .attr("class", "inputnumber")
        .attr("placeholder", "station id")
        .attr("type", "number")
        .attr("min", "1").attr("max", "5000")
        .attr("onchange", appname + ".addStation(this.value)");

    //hours of the day
    this.all_xValues=[];
    //number of bikes
    this.all_yValues=[];
    //stations for comparisons
    this.stations=[];
    
    this.setOption(null,null,null,null);
}

LineChart5.prototype.addStation = function (station_id){
    if(station_id!="")
        this.stations[this.stations.length]=station_id;
    console.log(this.stations);
    
    this.setOption(null,null,null);
}
    

LineChart5.prototype.setOption = function (gender, usertype, date) {
    this.callBack_getData(this, gender, usertype, date);
}

LineChart5.prototype.callBack_getData = function (context, gender, usertype, date) {

    context.xValues = [];
    context.yValues = [];
    d3.select(this.titletag).text("AVG bikes out per HOUR - Stations Comparison");
        
    var parameters;
    parameters = "query=q3";
    for(i=0;i<context.stations.length;i++){
        // station id: null means ALL
        if (context.stations[i] != null)
            parameters = parameters + "&station=" + context.stations[i];
        
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
            console.log(i);
            console.log(context.stations.length);
            if(i==context.stations.length){
                console.log("YYY"+context.all_yValues);
                console.log("XXX"+context.all_xValues);
                context.draw(context.all_xValues,context.all_yValues);
            }
        });
    }
    
}

LineChart5.prototype.draw = function (all_xValues,all_yValues) {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();
    
    console.log("DRAW: "+all_yValues);
    
    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    //var xValues = this.xValues;
    //var yValues = this.yValues;

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(all_xValues[0]);

    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0,800]);//.domain([0, max(yValues) * 1.1]);

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
    
    for(ind=0; ind<all_yValues.length; ind++){
        console.log("AAAA");
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
            .attr("transform", "translate(" + this.margin.left + ",0)");
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

function dotSeparator(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
}

function max(array) {
    return Math.max.apply(Math, array);
}