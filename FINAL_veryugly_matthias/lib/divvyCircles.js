// divvy circles objects to make code cleaner
function DivvyCircles (){
    this.circles = [];
    this.showPop = false;
    this.fill = "red";      //default
    this.outline = "red";   //default
}

DivvyCircles.prototype.addData = function (data, fill, outline, radius){
    this.fill = fill;
    this.outline = outline;
    for (var i = 0; i < data.length; i++) {
        // add circle objects to array
        this.circles.push( L.circleMarker([data[i]["latitude"], data[i]["longitude"]], {
            radius : radius,
            color: outline,
            fillColor: fill,
            fillOpacity: 1,
            opacity: 1,
            stationID : data[i]["station_id"],
            stationName : data[i]["station_name"]
        }));
        
        // bind data
        this.circles[i].on('click', function(d){
            console.log(d.target.options.stationName);
        });
        this.circles[i].bindPopup("hello");
    };

    console.log(this.circles);
};

DivvyCircles.prototype.getCircles = function (){
    return this.circles;
};

DivvyCircles.prototype.colorPop = function (){
    this.showPop = !this.showPop;       //toggle
    context = this;
    // heat map of popularity 
    if (this.showPop) {
        // get data
        d3.json("query.php?query=m1", function(error, data){
            if (error){
                console.warn(error);
            };
            console.log(data);

            var max = 0;
            var min = Number.MAX_VALUE;
            for (var i = 0; i < data.length; i++) {
                if(max < parseInt(data[i]["count(*)"]))
                    max = parseInt(data[i]["count(*)"]);
                if (min > parseInt(data[i]["count(*)"])) 
                    min = parseInt(data[i]["count(*)"]);
            };

            console.log(max);
            console.log(min);

            // heat map colors
            var heatScale = d3.scale.sqrt()
                .domain([min, max])
                .range(["#fff7bc", "#f03b20"]);

            // set colors
            for (var i = 0; i < context.circles.length; i++) {
                var color = heatScale(getPop(data, context.circles[i].options.stationID));
                context.circles[i].setStyle({fillColor: color});
                context.circles[i].setStyle({color: color});
            };
        });
    }

    // normal colors
    else{
        for (var i = 0; i < context.circles.length; i++) {
            context.circles[i].setStyle({fillColor: context.fill});
            context.circles[i].setStyle({color: context.outline});
        };
    };

    // helper function
    function getPop(data, stationID){
        for (var i = 0; i < data.length; i++) {
            if(data[i]["from_station_id"] == stationID){
                return parseInt(data[i][["count(*)"]]);
            }
        };
    }
}