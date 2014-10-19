// divvy circles objects to make code cleaner
function DivvyCircles (){
    // object
    stationObj = new Object();
    // map object 
    var map;

    var circles = [];
    this.showPop = false;
    this.showDate = false;
    this.fill = "red";      //default
    this.outline = "red";   //default

    // used to control animation
    this.hour = 0;
    var animationOn = false;
    this.animationInterval;
    // true means start
    this.pauseStart = false;
    this.polylines = null; 

    // used for showing the correct information in the div
    var stationClicked = 0;

    // used for switching between flowlines
    flowOn = false;

    // top left div showing information and controls
    var stationInformation = L.control({position: 'topleft'});

    stationInformation.onAdd = function(){
        this._div = L.DomUtil.create('div', 'stationInformation');
        this.update(null, false);
        return this._div;
    };

    stationInformation.update = function(info, ShowFlow){
        if (!ShowFlow){
            this._div.innerHTML = '<h5>Station:</h5>' + (info ? '<p>ID:' + info.id + '<br>Name:' + info.name + 
                '</p>' : '<p>Hover or Click on Station</p>');
        }
        else if (ShowFlow) {
            this._div.innerHTML = '<h5>Station:</h5>' + (info ? '<p>ID:' + info.id + '<br>Name:' + info.name +
                '<hr><p>Flow:</p>' +
                '</p> <div id="flow">' + 
                '<input type="checkbox" id="check1"><label for="check1">In</label>' +
                '<input type="checkbox" id="check2"><label for="check2">Out</label>' +
                '</div>' : '<p>Hover or Click on Station</p>');

            $( "#check1" ).button();
            $( "#check2" ).button();
            $( "#flow" ).buttonset();

            // add listeners
            $( "#check1" ).on("click", function(){
                flowLines(1);
            });

            $( "#check2" ).on("click", function(){
                flowLines(2);
            });
        };
    };

    function flowLines (flow){
        var context = this;
        if (flowOn) {
            map.removeLayer(context.polylines);
            returnToNormal();
            flowOn = false;
            return;
        }
        else
            flowOn = true;
        
        var parameters;
        var hiColor = "";
        var loColor = "";

        loColor = "#fff7bc";
        hiColor = "#f03b20";

        // inflow
        if (flow == 1) {
            parameters = "query=m5&id=" + stationClicked;
            
        }
        // outflow
        else if (flow == 2) {
            parameters = "query=m6&id=" + stationClicked;
        };

        d3.json("query.php?" + parameters, function(error, data){
            // find range
            var max = 0;
            var min = Number.MAX_VALUE;

            for (var i = data.length - 1; i >= 0; i--) {
                if(data[i]["count(*)"] > max)
                    max = data[i]["count(*)"];
                if (data[i]["count(*)"] < min)
                    min = data[i]["count(*)"];
            };

            // heat map colors
            var heatScale = d3.scale.linear()
                .domain([min, max])
                .range([loColor, hiColor]);

            // inflow/outflow var
            var whichDir = "";
            if (flow == 1)
                whichDir = "from_station_id";
            else
                whichDir = "to_station_id";

            var polylineArray = [];

            for (var i = 0; i < data.length; i++) {
                var fromLatLng = [0,0];
                var toLatLng = [0,0];
                for (var q = 0; q < circles.length; q++) {
                    // flow stations
                    var color = heatScale(data[i]["count(*)"]);

                    if (data[i][whichDir] == circles[q].options.stationID) {
                        fromLatLng[0] = circles[q]._latlng.lat;
                        fromLatLng[1] = circles[q]._latlng.lng;
                        
                        circles[q].setStyle({fillColor: color});
                        // circles[q].setStyle({color: "black"});

                        // for some reason this is not working :(
                        // circles[q].bringToFront();
                    };

                    // clicked station
                    if (stationClicked == circles[q].options.stationID) {
                        toLatLng[0] = circles[q]._latlng.lat;
                        toLatLng[1] = circles[q]._latlng.lng;

                        if (flow == 1)
                            circles[q].setStyle({fillColor: "#F05305"});   
                        else
                            circles[q].setStyle({fillColor: "#05A2F0"});

                        circles[q].setStyle({color: "black"});
                    };
                };

                lineColor = "";
                if (flow == 1)
                    lineColor = "#F05305"
                else
                    lineColor = "#05A2F0";

                polylineArray.push(L.polyline([fromLatLng, toLatLng], 
                    {   
                        color: lineColor,
                        weight: 3,
                        opacity: .5,
                        clickable: false
                    })
                );
            };
            context.polylines = L.layerGroup(polylineArray);
            context.polylines.addTo(map);
        }); 
    };

    // animation function
    function dataLines (context, mapContext, date, spinner){

        console.log(context.hour);

        if (context.hour > 23) {
            // clear stuff
            conanimationOn = false;
            clearInterval(context.animationInterval);
            return;
        }
        else if (context.polylines != null){
            mapContext.removeLayer(context.polylines);
        }

        // normal color circles
        for (var i = 0; i < circles.length; i++) {
            circles[i].setStyle({fillColor: context.fill});
            circles[i].setStyle({color: context.outline});
        };

        var parameters = "query=m4&hour=" + context.hour + "&date=" + date;
        d3.json("query.php?" + parameters, function(error, data){
            if (error){
                console.warn(error);
            };
            var polylineArray = [];

            for (var i = 0; i < data.length; i++) {
                var fromLatLng = [0,0];
                var toLatLng = [0,0];
                for (var q = 0; q < circles.length; q++) {
                    // from locatation
                    if (data[i]["from_station_id"] == circles[q].options.stationID) {
                        fromLatLng[0] = circles[q]._latlng.lat;
                        fromLatLng[1] = circles[q]._latlng.lng;

                        circles[q].setStyle({fillColor: "#05A2F0"});
                        circles[q].setStyle({color: "black"});
                    };

                    // to locations
                    if (data[i]["to_station_id"] == circles[q].options.stationID) {
                        toLatLng[0] = circles[q]._latlng.lat;
                        toLatLng[1] = circles[q]._latlng.lng;

                        circles[q].setStyle({fillColor: "#F05305"});
                        circles[q].setStyle({color: "black"});
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
    
        if (animationOn){
            spinner.spinner("value", context.hour);
            context.hour++;
        }
    }; //end of datalines function

    function init(data, fill, outline, radius, mapContext){
        map = mapContext;
        this.fill = fill;
        this.outline = outline;
        for (var i = 0; i < data.length; i++) {
            // add circle objects to array
            circles.push( L.circleMarker([data[i]["latitude"], data[i]["longitude"]], {
                zindex: 10,
                radius: radius,
                color: outline,
                fillColor: fill,
                fillOpacity: 1,
                opacity: 1,
                stationID: data[i]["station_id"],
                stationName: data[i]["station_name"]
            }));
            
            // bind data
            circles[i].on('click', function(d){
                var info = {id : d.target.options.stationID, name : d.target.options.stationName};

                // is it safe to change info div
                var flow = false;
                if (stationClicked == info.id){
                    flow = false;
                    stationClicked = 0;
                }
                else{
                    flow = true;
                    stationClicked = info.id;
                }

                // clear lines if drawn
                if (flowOn) {
                    map.removeLayer(polylines);
                    returnToNormal();
                    flowOn = false;
                };
                
                // update info div
                stationInformation.update(info, flow);
            });
            circles[i].on("mouseover", function(d){
                if (stationClicked == 0) {
                    var info = {id : d.target.options.stationID, name : d.target.options.stationName};
                    stationInformation.update(info, false);
                };
            });
        };

        // add station info div
        stationInformation.addTo(mapContext);
    };

    function getCircles(){
        return circles;
    };

    // function that colors the stations based on wheter a trip is incoming or outgoing along with 
    // drawing lines representing the trip
    function colorDate (date, hour, pause, mapContext, spinner, stop){
        this.showDate = !this.showDate;
        this.hour = hour;
        var context = this;

        if (pause && !this.pauseStart) {
            this.pauseStart = true;
            animationOn = !animationOn;
        }
        else if (this.pauseStart && pause) {
            this.pauseStart = false;
        };

        // run animation
        if (animationOn && this.pauseStart){
            animationOn = true;
            //call dataLines every 1sec
            this.animationInterval = setInterval( function() {dataLines(context, mapContext, date, spinner)}, 1000);
        }
        // stop animation
        else if (animationOn && !this.pauseStart) {
            clearInterval(this.animationInterval);
            animationOn = false;
        }
        // manual control
        else if (!animationOn && !pause && !stop) {
            spinner.spinner("value", this.hour);
            dataLines(context, mapContext, date)
        }
        // clear
        else if(stop){
            clearInterval(this.animationInterval);
            animationOn = false;
            this.hour = 0;
            spinner.spinner("value", 0);
            if (this.polylines != null){
                mapContext.removeLayer(this.polylines);
            }
        };

    };

    // function that makes heat map of pop of the stations
    function colorPop(){
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
                for (var i = 0; i < circles.length; i++) {
                    var color = heatScale(getPop(data, circles[i].options.stationID));
                    circles[i].setStyle({fillColor: color});
                    circles[i].setStyle({color: "black"});
                };
            });
        }

        // normal colors
        else{
            for (var i = 0; i < circles.length; i++) {
                circles[i].setStyle({fillColor: context.fill});
                circles[i].setStyle({color: context.outline});
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
    };

    function returnToNormal(){
        var context = this;
        for (var i = 0; i < circles.length; i++) {
                circles[i].setStyle({fillColor: "grey"});
                circles[i].setStyle({color: "black"});
        };
    };

    stationObj.init = init;
    stationObj.getCircles = getCircles;
    stationObj.colorPop = colorPop;
    stationObj.colorDate = colorDate;
    stationObj.returnToNormal = returnToNormal;
    return stationObj
};



