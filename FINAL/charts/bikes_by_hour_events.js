function LineChart5(tag, titletag) {

    this.tag = tag;
    this.titletag = titletag;
    this.margin = {
        top: 0,
        right: 30,
        bottom: 60,
        left: 60
    };

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;


    d3.select(titletag).text("Bikes out per HOUR during the DAY");
    
    var legendSvg = d3.select(this.tag)
        .append("svg");
    
    legendSvg.attr("class", "legend_chart_svg")
        .attr("viewBox", "0 0 100 100")
        .append("rect").attr("x", 0)
        .attr("y", 0)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("style","stroke:black;stroke-width:5")
        .style('fill-opacity', 0.15)
        .style('fill', '#23aa17');
    
    d3.select(tag).append("p").attr("style","float: left").text("Lunch and Dinner");
    
    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("id","mainSvg")
        .attr("class", "line_chart_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);
        //.attr("preserveAspectRatio", "xMinYMin meet");

    //hours of the day
    this.xValues = [];
    //number of bikes
    this.yValues = [];
    
    //Sunset and sunrise dates
    this.sunsetDate = null;
    this.sunriseDate = null;
    
    this.setOption(null,null,null,null, null, null);
}

LineChart5.prototype.setOption = function (station, gender, usertype, date, agemin, agemax) {
    this.callBack_getData(this, station, gender, usertype, date, agemin, agemax);
}

LineChart5.prototype.callBack_getData = function (context, station, gender, usertype, date, agemin, agemax) {
    
    if (date == null) {
        this.resetSvg();
        
        d3.select("#mainSvg")
            .append("text")
            .attr("x", this.canvasWidth / 3 +15)
            .attr("y", this.canvasHeight / 2)
            .text("Pick a day")
            .attr("fill","steelblue")
            .attr("font-size","5vh");
        d3.select(this.titletag).text("Bikes out per HOUR during the DAY");
        return;
    }

    context.xValues = [];
    context.yValues = [];
    
    var parameters;
    parameters = "query=q3";

    // station id: null means ALL
    if (station != null)
        parameters = parameters + "&station=" + station;
    
    // check gender
    if(gender != null)
        parameters = parameters + "&gender=" + gender;
    
    // check usertype
    if(usertype != null)
        parameters = parameters + "&usertype=" + usertype;
    
    if(agemin != null && agemax != null)
        parameters = parameters + "&agemin=" + parseInt(agemin) + "&agemax=" + parseInt(agemax);
    
    // check specific date
    if(date != null){
        var d = new Date(date);
        context.sunsetDate = SunCalc.getTimes(d, 41.83, -87.68).sunsetStart;
    context.sunriseDate = SunCalc.getTimes(d, 41.83, -87.68).sunriseEnd;
        parameters = parameters + "&day=" + d.getDate();
        parameters = parameters + "&month=" + (d.getMonth()+1);
        d3.select(this.titletag).text("Bikes out on "+dayName(d)+" "+(d.getMonth()+1)+"/"+d.getDate()+"/"+d.getFullYear());
    }

    d3.json("db_get.php?" + parameters, function (error, data) {
        data.forEach(function (d) {
            context.xValues[context.xValues.length] = d.hour;
            context.yValues[context.yValues.length] = d.num_bikes;
        });
        context.draw();
    });
}

LineChart5.prototype.draw = function () {
    
    this.resetSvg();
    
    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    var xValues = this.xValues;
    var yValues = this.yValues;
    
    var sunsetDate = this.sunsetDate;
    var sunriseDate = this.sunriseDate;

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xValues);

    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, max(yValues) * 1.1]);

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
        .tickPadding(7).ticks(7);
    
    /*
    //zoom variable
    var zoom = d3.behavior.zoom()
        //.x(xScale)
        .y(yScale)
        .scaleExtent([1, 2])
        .on("zoom", zoomed);*/	

    var svg = this.svg;
    
    // Lunch
    svg.append("rect")
        .attr("id","lunch")
        .attr("x", parseFloat(margin.left + width/2))
        .attr("y", 0)
        .attr("width", width / 9)
        .attr("height", height)
        .style('opacity', 0.15)
        .style('fill', '#23aa17');

    // Dinner
    svg.append("rect")
        .attr("id","dinner")
        .attr("x", parseFloat(margin.left + width / 1.3))
        .attr("y", 0)
        .attr("width", width / 9)
        .attr("height", height)
        .style('opacity', 0.15)
        .style('fill', '#23aa17');
    
    //svg.call(zoom);
    
    //svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var line = d3.svg.line()
        .x(function (d, i) {
            return xScale(xValues[i]);
        })
        .y(function (d, i) {
            return yScale(yValues[i]);
        });

    svg.append("path")
        .datum(yValues)
        .attr("class", "chart line")
        .attr("d", line)
        .attr("transform", "translate(" + margin.left + ",0)");

    var padding = width / xValues.length;

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

    /*
    // Vertical Lines
    gx.selectAll("g")
        .classed("xminor", true)
        .select("line")
        .attr("y2", function (d, i) {
            return -height + yScale(yValues[i]);
        });
    */
    
    var sunriseX = margin.left + getXRelativePosition(sunriseDate,width);
    var sunsetX = margin.left + getXRelativePosition(sunsetDate,width);
    // SUNRISE LINE
    svg.append("line")
        .attr("x1", sunriseX)
        .attr("x2", sunriseX)
        .attr("y1", height*0.03)
        .attr("y2", height)
        .attr("stroke","gray");
    
    // SUNSET LINE
    svg.append("line")
        .attr("x1", sunsetX)
        .attr("x2", sunsetX)
        .attr("y1", height*0.03)
        .attr("y2", height)
        .attr("stroke","gray");
    

    svg.append("circle")
        .attr("cx", (sunriseX+margin.left) / 2)
        .attr("cy", height*0.1)
        .attr("r", height*0.07)
        .attr("fill","#474b65");
    
    svg.append("circle")
        .attr("cx", (sunriseX+sunsetX) / 2)
        .attr("cy", height*0.1)
        .attr("r", height*0.07)
        .attr("fill","#e3b13c");
    
    svg.append("circle")
        .attr("cx", (sunsetX+width+margin.left) / 2)
        .attr("cy", height*0.1)
        .attr("r", height*0.07)
        .attr("fill","#474b65");

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
    
    
    //zoom function
    function zoomed() {
        //svg.select(".x.axis").call(xAxis);
        svg.select(".x.axis")
            .call(xAxis.scale(xScale.rangePoints([0, width * d3.event.scale],.001 * d3.event.scale)));
        
        
        svg.select(".y.axis").call(yAxis);   
        
        svg.selectAll(".chart.line").attr('d', line);
           // .attr("transform", "translate(" + zoom.translate()+")"+"scale(" + zoom.scale() + ")");
        
        gy.selectAll("g")
            .classed("yminor", true)
            .select("line")
            .attr("x2", function (d, i) {
            return width;
        });
        
        gx.selectAll("text")
            .attr("transform","rotate(-35)")
            .style("text-anchor", "end");
        
        /*gx.selectAll("text")
            .attr("transform", "translate("+zoom.translate()+")"+"scale("+zoom.scale()+")"+"rotate(-35)");*/
        
        /*gx.selectAll("text")        
            .attr("transform", "translate(" + d3.event.translate[0]+",0) rotate(-35)")
        .style("text-anchor", "end");*/
        
        /*d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(xValues)*/
        
        /*svg.selectAll(".chart.line").attr('d', line)
            .attr("transform", "translate(" + d3.event.translate[0]+",0)")
            .call(xAxis.scale(xScale.rangePoints([0, width],0)));*/
    }

}

LineChart5.prototype.resetSvg = function () {
    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();
    d3.select(this.tag).selectAll("text").remove();
    d3.select(this.tag).selectAll("#lunch").remove();
    d3.select(this.tag).selectAll("#dinner").remove();
    d3.select(this.tag).selectAll("line").remove();
    d3.select(this.tag).selectAll("circle").remove();
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