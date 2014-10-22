// divvy circles objects to make code cleaner
function DivvyCircles() {
    // object
    stationObj = new Object();
    // map object 
    var map;

    var circles = [];
    this.showPop = false;
    this.showDate = false;
    this.fill = "red"; //default
    this.outline = "red"; //default

    // used to control animation
    this.hour = 0;
    var animationOn = false;
    this.animationInterval;
    // true means start
    this.pauseStart = false;
    this.polylines = null;

    // used for showing the correct information in the div
    var selectedStationsHTML = '';
    var stationClicked = 0;
    var selectedStations = [];
    var allowHover = true;

    //Weather
    this.weatherIcon = null;
    this.pickedDate = null;

    // used for switching between flowlines
    flowOn = false;

    // helper method
    function indexOfObject(theArray, property, value) {
        for (var i = 0, len = theArray.length; i < len; i++) {
            if (theArray[i][property] === value) return i;
        }
        return -1;
    };

    // top left div showing information and controls
    var stationInformation = L.control({
        position: 'topleft'
    });

    stationInformation.onAdd = function () {
        this._div = L.DomUtil.create('div', 'stationInformation');
        this.update(null, false);
        return this._div;
    };

    stationInformation.update = function (info, ShowFlow) {
        // show hovered station
        if (!ShowFlow) {
            if (info != null) {

                if (selectedStations.length == 0) {
                    this._div.innerHTML = '<h5>Stations:</h5> <hr>' + '<p>ID:' + info.id + '<br>' + info.name + '</p>';
                } else {
                    this._div.innerHTML = '<h5>Stations:</h5> <hr>' + '<p>ID:' + info.id + '<br>' + info.name + '</p>' + selectedStationsHTML;
                    addFlowButtons(this);
                };
            } else
                this._div.innerHTML = '<h5>Stations:</h5> <hr> <p>Hover or Click on Stations</p>';
        }
        // show clicked stations
        else if (ShowFlow) {
            this._div.innerHTML = '<h5>Stations:</h5>';
            selectedStationsHTML = '';

            if (info.length > 5) {
                selectedStationsHTML = '<hr> <p>' + info.length + ' stations selected<p>';
                this._div.innerHTML += '<hr> <p>' + info.length + ' stations selected<p>';
            } else {
                for (var i = 0; i < info.length; i++) {
                    this._div.innerHTML += '<hr><p>ID:' + info[i].id + '<br>Name:' + info[i].name + '</p>'
                    selectedStationsHTML += '<hr><p>ID:' + info[i].id + '<br>Name:' + info[i].name + '</p>';
                };
            }

            // add checkboxes/buttons
            addFlowButtons(this);
        };

        function addFlowButtons(elem) {
            elem._div.innerHTML += '<hr><p>Flow:</p>' +
                '</p> <div id="flow">' +
                '<input type="checkbox" id="check1"><label for="check1">In</label>' +
                '<input type="checkbox" id="check2"><label for="check2">Out</label>' +
                '</div>';

            $("#check1").button();
            $("#check2").button();
            $("#flow").buttonset();

            // add listeners
            $("#check1").on("click", function () {
                flowLines(1);
            });

            $("#check2").on("click", function () {
                flowLines(2);
            });
        }
    };

    function flowLines(flow) {
        var context = this;
        if (flowOn) {
            map.removeLayer(context.polylines);
            returnToNormal();
            flowOn = false;
            return;
        } else
            flowOn = true;

        var parameters;
        var hiColor = "";
        var loColor = "";
        var allTrips = [];
        var sumOfTotalFlow = [];

        var dataCount = 0;

        loColor = "#fff7bc";
        hiColor = "#f03b20";

        // inflow
        if (flow == 1) {
            for (var i = 0; i < selectedStations.length; i++) {
                parameters = "query=m5&id=" + selectedStations[i].options.stationID;
                getData(parameters, "from_station_id", selectedStations[i].options.stationID);
            };
        }
        // outflow
        else if (flow == 2) {
            for (var i = 0; i < selectedStations.length; i++) {
                parameters = "query=m6&id=" + selectedStations[i].options.stationID;
                getData(parameters, "to_station_id", selectedStations[i].options.stationID);
            };
        };

        // using the agregated data make lines showing the flow
        function makeLines(fromOrTo) {
            // find range
            var max = 0;
            var min = Number.MAX_VALUE;

            console.log(sumOfTotalFlow.length);

            for (var i = sumOfTotalFlow.length - 1; i >= 0; i--) {
                if (sumOfTotalFlow[i]["count(*)"] > max)
                    max = sumOfTotalFlow[i]["count(*)"];
                if (sumOfTotalFlow[i]["count(*)"] < min)
                    min = sumOfTotalFlow[i]["count(*)"];
            };

            console.log(max);
            console.log(min);

            // heat map colors
            var heatScale = d3.scale.linear()
                .domain([min, max])
                .range([loColor, hiColor]);

            // array containing the lines
            var polylineArray = [];

            // start creating lines!!!
            for (var i = 0; i < allTrips.length; i++) {
                var fromLatLng = [0, 0];
                var toLatLng = [0, 0];

                for (var q = 0; q < circles.length; q++) {
                    // flow stations
                    var index = indexOfObject(sumOfTotalFlow, fromOrTo, allTrips[i]["theOtherStationID"]);
                    var color = heatScale(sumOfTotalFlow[index]["count(*)"]);

                    if (allTrips[i]["theOtherStationID"] == circles[q].options.stationID) {
                        fromLatLng[0] = circles[q]._latlng.lat;
                        fromLatLng[1] = circles[q]._latlng.lng;

                        circles[q].setStyle({
                            fillColor: color
                        });
                    };

                    // // selected stations
                    if (allTrips[i]["selectedStationID"] == circles[q].options.stationID) {
                        toLatLng[0] = circles[q]._latlng.lat;
                        toLatLng[1] = circles[q]._latlng.lng;

                        circles[q].setStyle({
                            color: "green"
                        });

                    };
                };

                // choose the correct line color for the flow lines
                lineColor = "";
                if (flow == 1)
                    lineColor = "#F05305"
                else
                    lineColor = "#05A2F0";

                // to fix later, color the lines that are in the set of stations clicked
                // var index = indexOfObject(sumOfTotalFlow, fromOrTo, allTrips[i]["theOtherStationID"]);
                // if (sumOfTotalFlow[index][fromOrTo] == allTrips[i]["selectedStationID"]){
                //     lineColor = "green";
                //     console.log("hi");
                // }

                polylineArray.push(L.polyline([fromLatLng, toLatLng], {
                    color: lineColor,
                    weight: 1,
                    opacity: .5,
                    clickable: false
                }));
            };
            context.polylines = L.layerGroup(polylineArray);
            context.polylines.addTo(map);

            for (var i = 0; i < allTrips.length; i++) {
                for (var q = 0; q < circles.length; q++) {
                    if (allTrips[i]["theOtherStationID"] == circles[q].options.stationID ||
                        allTrips[i]["selectedStationID"] == circles[q].options.stationID) {

                        circles[q].bringToFront();
                    };
                }
            };

        };

        // retrieves and parses the data that comes from the database
        function getData(params, fromOrTo, station) {
            d3.json("query.php?" + params, function (data) {
                // combine all the values of the diff stations
                for (var i = 0; i < data.length; i++) {
                    // keep track of the from and to for each trip
                    allTrips.push({
                        selectedStationID: station,
                        theOtherStationID: data[i][fromOrTo]
                    });

                    // make count vals ints
                    data[i]["count(*)"] = parseInt(data[i]["count(*)"])
                    // find index and either update or push values
                    var index = indexOfObject(sumOfTotalFlow, fromOrTo, data[i][fromOrTo]);
                    if (index < 0) {
                        sumOfTotalFlow.push(data[i]);
                    } else
                        sumOfTotalFlow[index]["count(*)"] += data[i]["count(*)"];
                };

                dataCount++;
                if (dataCount == selectedStations.length) {
                    makeLines(fromOrTo);
                };
            });
        };
    };

    // animation function
    function dataLines(context, mapContext, date, spinner) {

        console.log("dataLines hour: " + context.hour);

        if (context.hour > 23) {
            // clear stuff
            conanimationOn = false;
            clearInterval(context.animationInterval);
            return;
        } else if (context.polylines != null) {
            mapContext.removeLayer(context.polylines);
        }

        // normal color circles
        for (var i = 0; i < circles.length; i++) {
            circles[i].setStyle({
                fillColor: context.fill
            });
            circles[i].setStyle({
                color: context.outline
            });
        };

        var parameters = "query=m4&hour=" + context.hour + "&date=" + date;
        d3.json("query.php?" + parameters, function (error, data) {
            if (error) {
                console.warn(error);
            };
            var polylineArray = [];

            for (var i = 0; i < data.length; i++) {
                var fromLatLng = [0, 0];
                var toLatLng = [0, 0];
                for (var q = 0; q < circles.length; q++) {
                    // from locatation
                    if (data[i]["from_station_id"] == circles[q].options.stationID) {
                        fromLatLng[0] = circles[q]._latlng.lat;
                        fromLatLng[1] = circles[q]._latlng.lng;

                        circles[q].setStyle({
                            fillColor: "#05A2F0"
                        });
                        circles[q].setStyle({
                            color: "black"
                        });
                    };

                    // to locations
                    if (data[i]["to_station_id"] == circles[q].options.stationID) {
                        toLatLng[0] = circles[q]._latlng.lat;
                        toLatLng[1] = circles[q]._latlng.lng;

                        circles[q].setStyle({
                            fillColor: "#F05305"
                        });
                        circles[q].setStyle({
                            color: "black"
                        });
                    };
                };

                polylineArray.push(L.polyline([fromLatLng, toLatLng], {
                        color: "orange",
                        weight: 3,
                        opacity: .5,
                    })
                    .on("click", function (target) {
                        target.target.setStyle({
                            color: "red",
                            opacity: 1
                        });;
                    })
                );
            };
            context.polylines = L.layerGroup(polylineArray);
            context.polylines.addTo(mapContext);
        });

        if (animationOn) {
            spinner.spinner("value", context.hour);
            context.hour++;
        }

        if (context.pickedDate != null) {
            // Change weather icon
            context.pickedDate.setHours(context.hour);
            context.weatherIcon.draw(context.pickedDate);
        }

    }; //end of datalines function

    function init(data, fill, outline, radius, mapContext) {
        map = mapContext;
        this.fill = fill;
        this.outline = outline;
        for (var i = 0; i < data.length; i++) {
            // add circle objects to array
            circles.push(L.circleMarker([data[i]["latitude"], data[i]["longitude"]], {
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
            circles[i].on('click', function (d) {
                var info = {
                    id: d.target.options.stationID,
                    name: d.target.options.stationName
                };

                // is it safe to change info div
                var index = -1;
                for (var i = selectedStations.length - 1; i >= 0; i--) {
                    if (selectedStations[i].options.stationID === info.id) {
                        index = i;
                        break;
                    };
                };

                if (index > -1) {
                    selectedStations.splice(index, 1);
                } else{
                    selectedStations.push(d.target);
                    
                    //this is for adding lines to charts in the comparison section
                    
                    //if("sono nella pagina giusta"){
                        //app1.addStation(d.target.options.stationID);
                        app1.stations=[];
                        for(var i=0;i<selectedStations.length;i++){
                            app1.stations[app1.stations.length]=selectedStations[i].options.stationID;
                        }
                        app1.setOption(null,null,null);
                        
                    //}
                }

                showInfo();

                // var flow = false;
                // if (stationClicked == info.id){
                //     flow = false;
                //     stationClicked = 0;
                // }
                // else{
                //     flow = true;
                //     stationClicked = info.id;
                // }

                // // clear lines if drawn
                // if (flowOn) {
                //     map.removeLayer(polylines);
                //     returnToNormal();
                //     flowOn = false;
                // };

                // // update info div
                // stationInformation.update(info, flow);
            });
            circles[i].on("mouseover", function (d) {
                var info = {
                    id: d.target.options.stationID,
                    name: d.target.options.stationName
                };
                stationInformation.update(info, false);
            });
        };

        // add station info div
        stationInformation.addTo(mapContext);
    };

    function showInfo() {
        // color staions default
        returnToNormal()
        // color selected green
        for (var i = selectedStations.length - 1; i >= 0; i--) {
            selectedStations[i].setStyle({
                fillColor: "green"
            })
            selectedStations[i].bringToFront();
        };

        // check to see if hover can be used again
        if (selectedStations.length == 0) {
            if (flowOn) {
                map.removeLayer(polylines);
                returnToNormal();
                flowOn = false;
            };
            // show nothing in info div
            stationInformation.update(null, false);
        }
        // show info regarding the selected stations
        else {
            var info = [];
            for (var i = selectedStations.length - 1; i >= 0; i--) {
                info.push({
                    id: selectedStations[i].options.stationID,
                    name: selectedStations[i].options.stationName
                });
            };
            stationInformation.update(info, true);
        };

    }

    function getCircles() {
        return circles;
    };

    // function that colors the stations based on wheter a trip is incoming or outgoing along with 
    // drawing lines representing the trip
    function colorDate(date, hour, pause, mapContext, spinner, stop) {
        this.showDate = !this.showDate;
        this.hour = hour;
        var context = this;

        if (pause && !this.pauseStart) {
            this.pauseStart = true;
            animationOn = !animationOn;
        } else if (this.pauseStart && pause) {
            this.pauseStart = false;
        };

        // run animation
        if (animationOn && this.pauseStart) {
            animationOn = true;
            //call dataLines every 1sec
            this.animationInterval = setInterval(function () {
                dataLines(context, mapContext, date, spinner)
            }, 3000);
        }
        // stop animation
        else if (animationOn && !this.pauseStart) {
            clearInterval(this.animationInterval);
            animationOn = false;
        }
        // manual control
        else if (!animationOn && !pause && !stop) {
            spinner.spinner("value", this.hour);
            dataLines(context, mapContext, date);
        }
        // clear
        else if (stop) {
            clearInterval(this.animationInterval);
            animationOn = false;
            this.hour = 0;
            spinner.spinner("value", 0);
            if (this.polylines != null) {
                mapContext.removeLayer(this.polylines);
            }
        };

    };

    // function that makes heat map of pop of the stations
    function colorPop() {
        this.showPop = !this.showPop; //toggle
        var context = this;
        // heat map of popularity 
        if (this.showPop) {
            // get data
            d3.json("query.php?query=m1", function (error, data) {
                if (error) {
                    console.warn(error);
                };

                var max = 0;
                var min = Number.MAX_VALUE;
                for (var i = 0; i < data.length; i++) {
                    if (max < parseInt(data[i]["count(*)"]))
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
                    circles[i].setStyle({
                        fillColor: color
                    });
                    circles[i].setStyle({
                        color: "black"
                    });
                };
            });
        }

        // normal colors
        else {
            for (var i = 0; i < circles.length; i++) {
                circles[i].setStyle({
                    fillColor: context.fill
                });
                circles[i].setStyle({
                    color: context.outline
                });
            };
        };

        // helper function
        function getPop(data, stationID) {
            for (var i = 0; i < data.length; i++) {
                if (data[i]["from_station_id"] == stationID) {
                    return parseInt(data[i][["count(*)"]]);
                }
            };
        }
    };

    function returnToNormal() {
        var context = this;
        for (var i = 0; i < circles.length; i++) {
            circles[i].setStyle({
                fillColor: "grey"
            });
            circles[i].setStyle({
                color: "black"
            });
        };
    };

    function setWeatherInfo(wIc, pd) {
        this.weatherIcon = wIc;
        this.pickedDate = pd;
    }

    stationObj.init = init;
    stationObj.getCircles = getCircles;
    stationObj.colorPop = colorPop;
    stationObj.colorDate = colorDate;
    stationObj.returnToNormal = returnToNormal;
    stationObj.setWeatherInfo = setWeatherInfo;
    return stationObj
};