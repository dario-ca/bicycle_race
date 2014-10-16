// divvy circles objects to make code cleaner
function DivvyCircles (){
    this.circles = [];
    this.showPop = false;
    this.showDate = false;
    this.fill = "red";      //default
    this.outline = "red";   //default

    // used to control animation
    this.hour = 0;
    this.animationOn = false;
    this.animationInterval;
    // true means start
    this.pauseStart = false;

    this.polylines = null; 

    // animation function
    this.dataLines = function(context, mapContext, date, spinner){

        if (context.hour > 23) {
            // clear stuff
            this.animationOn = false;
            clearInterval(this.animationInterval);
            return;
        }
        else if (context.polylines != null){
            mapContext.removeLayer(context.polylines);
        }

        // normal color circles
        for (var i = 0; i < context.circles.length; i++) {
            context.circles[i].setStyle({fillColor: context.fill});
            context.circles[i].setStyle({color: context.outline});
        };

        var parameters = "query=m4&hour=" + context.hour + "&date=" + date;
        d3.json("query.php?" + parameters, function(error, data){
            if (error){
                console.warn(error);
            };
            console.log(data);
            var polylineArray = [];

            for (var i = 0; i < data.length; i++) {
                var fromLatLng = [0,0];
                var toLatLng = [0,0];
                for (var q = 0; q < context.circles.length; q++) {
                    // from locatation
                    if (data[i]["from_station_id"] == context.circles[q].options.stationID) {
                        fromLatLng[0] = context.circles[q]._latlng.lat;
                        fromLatLng[1] = context.circles[q]._latlng.lng;

                        context.circles[q].setStyle({fillColor: "#05A2F0"});
                        context.circles[q].setStyle({color: "black"});
                    };

                    // to locations
                    if (data[i]["to_station_id"] == context.circles[q].options.stationID) {
                        toLatLng[0] = context.circles[q]._latlng.lat;
                        toLatLng[1] = context.circles[q]._latlng.lng;

                        context.circles[q].setStyle({fillColor: "#F05305"});
                        context.circles[q].setStyle({color: "black"});
                    };
                };

                polylineArray.push(L.polyline([fromLatLng, toLatLng], 
                    { 
                        color: "orange",
                        weight: 3,
                        opacity: .5,
                    })
                    .on("click", function(target){
                        target.target.setStyle({color: "red", opacity: 1});;
                    })
                );
            };
            context.polylines = L.layerGroup(polylineArray);
            context.polylines.addTo(mapContext);
        });

        
        
        if (this.animationOn){
            spinner.spinner("value", context.hour);
            context.hour++;
        }
    }
}

DivvyCircles.prototype.addData = function (data, fill, outline, radius){
    this.fill = fill;
    this.outline = outline;
    for (var i = 0; i < data.length; i++) {
        // add circle objects to array
        this.circles.push( L.circleMarker([data[i]["latitude"], data[i]["longitude"]], {
            radius: radius,
            color: outline,
            fillColor: fill,
            fillOpacity: 1,
            opacity: 1,
            stationID: data[i]["station_id"],
            stationName: data[i]["station_name"]
        }));
        
        // bind data
        this.circles[i].on('click', function(d){
            console.log(d.target.options.stationName);
        });
        this.circles[i].bindPopup("hello");
    };
};

DivvyCircles.prototype.getCircles = function (){
    return this.circles;
};

// function that colors the stations based on wheter a trip is incoming or outgoing along with 
// drawing lines representing the trip
DivvyCircles.prototype.colorDate = function (date, hour, pause, mapContext, spinner, stop){
    this.showDate = !this.showDate;
    this.hour = hour;
    var context = this;

    if (pause && !this.pauseStart) {
        this.pauseStart = true;
        this.animationOn = !this.animationOn;
    }
    else if (this.pauseStart && pause) {
        this.pauseStart = false;
    };

    // run animation
    if (this.animationOn && this.pauseStart){
        this.animationOn = true;
        this.animationInterval = setInterval( function() {context.dataLines(context, mapContext, date, spinner)}, 1000);     //call dataLines every 1sec
    }
    // stop animation
    else if (this.animationOn && !this.pauseStart) {
        clearInterval(this.animationInterval);
        this.animationOn = false;
    }
    // manual control
    else if (!this.animationOn && !pause && !stop) {
        spinner.spinner("value", this.hour);
        this.dataLines(context, mapContext, date)
    }
    // clear
    else if(stop){
        console.log("hello!");
        clearInterval(this.animationInterval);
        this.animationOn = false;
        this.hour = 0;
        spinner.spinner("value", 0);
        if (this.polylines != null){
            mapContext.removeLayer(this.polylines);
        }
    };

};

// function that makes heat map of pop of the stations
DivvyCircles.prototype.colorPop = function (){
    this.showPop = !this.showPop;       //toggle
    var context = this;
    // heat map of popularity 
    if (this.showPop) {
        // get data
        d3.json("query.php?query=m1", function(error, data){
            if (error){
                console.warn(error);
            };

            var max = 0;
            var min = Number.MAX_VALUE;
            for (var i = 0; i < data.length; i++) {
                if(max < parseInt(data[i]["count(*)"]))
                    max = parseInt(data[i]["count(*)"]);
                if (min > parseInt(data[i]["count(*)"])) 
                    min = parseInt(data[i]["count(*)"]);
            };

            // console.log(max);
            // console.log(min);

            // heat map colors
            var heatScale = d3.scale.sqrt()
                .domain([min, max])
                .range(["#fff7bc", "#f03b20"]);

            // set colors
            for (var i = 0; i < context.circles.length; i++) {
                var color = heatScale(getPop(data, context.circles[i].options.stationID));
                context.circles[i].setStyle({fillColor: color});
                context.circles[i].setStyle({color: "black"});
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

DivvyCircles.prototype.returnToNormal = function(){
    var context = this;
    for (var i = 0; i < context.circles.length; i++) {
            context.circles[i].setStyle({fillColor: context.fill});
            context.circles[i].setStyle({color: context.outline});
    };
};