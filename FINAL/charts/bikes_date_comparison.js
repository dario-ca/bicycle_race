function LineChart8(tag,legendtag,appname,titletag) {

    this.tag = tag;
    this.legendtag = legendtag;
    this.titletag = titletag;
    this.margin = {
        top: 0,
        right: 30,
        bottom: 43,
        left: 60
    };

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = document.getElementById(tag.id).clientHeight;

    d3.select(titletag).text("AVG bikes out per DAY - Stations Comparison");
    
    this.svg = d3.select(this.tag)
        .append("svg")
        .attr("class", "line_chart_svg")
        .attr("id","main_svg8")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight);

    this.legend_svg = d3.select(this.legendtag)
        .append("svg")
        .attr("class", "legend_svg")
        .attr("viewBox", "0 0 " + this.canvasWidth + " " + this.canvasHeight)
        .attr("preserveAspectRatio","xMinYMin meet");
    
   /* d3.select(this.tag).append("input")
        .attr("class", "inputnumber")
        .attr("placeholder", "station id")
        .attr("type", "number")
        .attr("min", "1").attr("max", "5000");
      //  .attr("onchange", appname + ".addStation(this.value)");*/
    
    

    //days of the year
    this.all_xValues=[];
    //number of bikes
    this.all_yValues=[];
    //stations for comparisons
    this.stations=[];
    this.stat_names=[];
    this.stat_ID=[];
    this.counter=0;
    this.csvStations=[];
    
    all_stat_and_id(this);
    
    if(this.stations.length==0){
        d3.select("#main_svg8")
                .append("text")
                .attr("x", this.canvasWidth / 3 - (this.canvasWidth/13.6) )
                .attr("y", this.canvasHeight / 2)
                .text("Pick stations from the map")
                .attr("fill","steelblue")
                .attr("font-size","5vh");
    }
    
}

LineChart8.prototype.addStation = function (station_id){
    if(station_id!=""){
        this.stations[this.stations.length]=station_id;
        this.setOption(null,null,null);
    }
    
}
   
LineChart8.prototype.setOption = function (gender, usertype, date) {
    this.callBack_getData(this, gender, usertype, date);
}

LineChart8.prototype.callBack_getData = function (context, gender, usertype, date) {
    
    context.counter=0;
    
    if(context.stations.length==0){
        d3.select(this.tag).selectAll("g").remove();
        d3.select(this.tag).selectAll("path").remove();
        d3.select(this.legendtag).selectAll("rect").remove();
        d3.select(this.legendtag).selectAll("text").remove();
        d3.select("#main_svg8")
                .append("text")
                .attr("x", this.canvasWidth / 3 - (this.canvasWidth/13.6) )
                .attr("y", this.canvasHeight / 2)
                .text("Pick stations from the map")
                .attr("fill","steelblue")
                .attr("font-size","5vh");
    }
    d3.select(this.titletag).text("AVG bikes out per DAY - Stations Comparison");
        
    var parameters;
    parameters = "query=q4";
    
    for(i=0;i<context.stations.length;i++){
        
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
            var station_ID = null;
            var station_Name = null;
            data.forEach(function (d) {
                yValues[yValues.length] = d.bikes;
                xValues[xValues.length] = d.day_year;
                station_ID = d.station;
            });
            
            context.all_yValues[context.counter]=yValues;
            context.all_xValues[context.counter]=xValues;
            context.stat_ID[context.counter]=station_ID;
            
            for(var index=0;index<context.csvStations.length;index++){
                    if(context.csvStations[index][0]==station_ID){
                        station_Name = context.csvStations[index][1];
                        context.stat_names[context.counter]=station_Name;
                    }
            }
            
            if(context.counter==context.stations.length-1){
                context.draw(context.all_xValues,context.all_yValues,context.stat_ID,context.stat_names);
                context.all_xValues=[];
                context.all_yValues=[];
                console.log(context.stations);
                d3.select("#main_svg8").select("text").remove();
            }
            context.counter++;
        });
    }
    
}

LineChart8.prototype.draw = function (all_xValues,all_yValues,all_IDs, all_names) {

    d3.select(this.tag).selectAll("g").remove();
    d3.select(this.tag).selectAll("path").remove();
    d3.select(this.legendtag).selectAll("rect").remove();
    d3.select(this.legendtag).selectAll("text").remove();
    
    var margin = this.margin;
    var width = this.canvasWidth - margin.left - margin.right;
    var height = this.canvasHeight - margin.top - margin.bottom;

    var xScale = d3.scale.ordinal()
        .rangePoints([0, width], 0).domain(dayLabels());
    
    var yScale = d3.scale.linear()
        .range([height, 0]).domain([0, maxValue(all_yValues) * 1.1]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickValues(xScale.domain().filter(function (d, i) {
            return !(i % 12);
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
    var legend_svg = this.legend_svg;

    for(ind=0; ind<all_yValues.length; ind++){
        var sum=0;
        var mul=1;
        var color_number=null;
        
        for(j=0;j<all_yValues[ind].length;j++){
            sum=sum+parseFloat(all_yValues[ind][j]);
            mul=mul*parseFloat(all_yValues[ind][j]);
        }
        
        console.log("station: "+all_IDs[ind]);
        console.log("overall sum: "+sum);
        console.log("value for color: "+color_number);
        
        var cur_color = "rgb("+Math.round((all_IDs[ind]*33)%255)+","+Math.round((all_IDs[ind]*all_IDs[ind])%255)+","+Math.round((all_IDs[ind]*44)%255)+")";
        console.log(cur_color);
        
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
        .attr("d", line).attr("transform", "translate(" + parseFloat(this.margin.left + 2) + ",0)")
            .style("stroke", cur_color);
        
       // if(all_yValues.length <= 10){
            legend_svg.append("rect")
                .attr("x","5")
                .attr("y",function(){
                    return 10+ind*40;
                })
                .attr("width","40")
                .attr("height","30")
                .style("fill",cur_color)
                .style("stroke","black")
                .style("stroke-width","2");

            legend_svg.append("text")
                .attr("class","legendText")
                .attr("x","60")
                .attr("y",function(){
                    return 35+ind*40;
                })
                .text(function(){
                    return (all_IDs[ind]+": "+all_names[ind]);
                });
       // }
        
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

function dayLabels(){
    var labels= ["Jun 27", "Jun 28", "Jun 29", "Jun 30", "Jul 1", "Jul 2", "Jul 3", "Jul 4", "Jul 5", "Jul 6", "Jul 7", "Jul 8", "Jul 9", "Jul 10", "Jul 11", "Jul 12", "Jul 13", "Jul 14", "Jul 15", "Jul 16", "Jul 17", "Jul 18", "Jul 19", "Jul 20", "Jul 21", "Jul 22", "Jul 23", "Jul 24", "Jul 25", "Jul 26", "Jul 27", "Jul 28", "Jul 29", "Jul 30", "Jul 31", "Aug 1", "Aug 2", "Aug 3", "Aug 4", "Aug 5", "Aug 6", "Aug 7", "Aug 8", "Aug 9", "Aug 10", "Aug 11", "Aug 12", "Aug 13", "Aug 14", "Aug 15", "Aug 16", "Aug 17", "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30", "Aug 31", "Sep 1", "Sep 2", "Sep 3", "Sep 4", "Sep 5", "Sep 6", "Sep 7", "Sep 8", "Sep 9", "Sep 10", "Sep 11", "Sep 12", "Sep 13", "Sep 14", "Sep 15", "Sep 16", "Sep 17", "Sep 18", "Sep 19", "Sep 20", "Sep 21", "Sep 22", "Sep 23", "Sep 24", "Sep 25", "Sep 26", "Sep 27", "Sep 28", "Sep 29", "Sep 30", "Oct 1", "Oct 2", "Oct 3", "Oct 4", "Oct 5", "Oct 6", "Oct 7", "Oct 8", "Oct 9", "Oct 10", "Oct 11", "Oct 12", "Oct 13", "Oct 14", "Oct 15", "Oct 16", "Oct 17", "Oct 18", "Oct 19", "Oct 20", "Oct 21", "Oct 22", "Oct 23", "Oct 24", "Oct 25", "Oct 26", "Oct 27", "Oct 28", "Oct 29", "Oct 30", "Oct 31", "Nov 1", "Nov 2", "Nov 3", "Nov 4", "Nov 5", "Nov 6", "Nov 7", "Nov 8", "Nov 9", "Nov 10", "Nov 11", "Nov 12", "Nov 13", "Nov 14", "Nov 15", "Nov 16", "Nov 17", "Nov 18", "Nov 19", "Nov 20", "Nov 21", "Nov 22", "Nov 23", "Nov 24", "Nov 25", "Nov 26", "Nov 27", "Nov 28", "Nov 29", "Nov 30", "Dec 1", "Dec 2", "Dec 3", "Dec 4", "Dec 5", "Dec 6", "Dec 7", "Dec 8", "Dec 9", "Dec 10", "Dec 11", "Dec 12", "Dec 13", "Dec 14", "Dec 15", "Dec 16", "Dec 17", "Dec 18", "Dec 19", "Dec 20", "Dec 21", "Dec 22", "Dec 23", "Dec 24", "Dec 25", "Dec 26", "Dec 27", "Dec 28", "Dec 29", "Dec 30", "Dec 31" ];
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

function all_stat_and_id(context){
    d3.csv("data/stations.csv", function (error, data) {
                data.forEach(function (d) {
                        context.csvStations[context.csvStations.length] = [d.station_id,d.station_name];
                    });
    });
}