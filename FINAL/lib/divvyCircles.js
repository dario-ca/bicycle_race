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
    var divNumber = 0;

    //Weather
    this.weatherIcon = null;
    this.pickedDate = null;

    // used for switching between flowlines
    var flowOn = false;

    // testing fix
    var self = this;

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
                "</p> <div class=\"flow\" id=\"flow" + divNumber + "\">" +
                "<input type=\"checkbox\" id=\"check1" + divNumber + "\"><label for=\"check1" + divNumber + "\">In</label>" +
                "<input type=\"checkbox\" id=\"check2" + divNumber + "\"><label for=\"check2" + divNumber + "\">Out</label>" +
                '</div>';

            $("#check1" + divNumber).button();
            $("#check2" + divNumber).button();
            $("#flow" + divNumber).buttonset();

            // add listeners
            $("#check1" + divNumber).on("click", function () {
                flowLines(1);
            });

            $("#check2" + divNumber).on("click", function () {
                flowLines(2);
            });
        }
    };

    function flowLines(flow) {
        if (flowOn) {
            map.removeLayer(self.polylines);
            colorSelectedStations();
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

            for (var i = sumOfTotalFlow.length - 1; i >= 0; i--) {
                if (sumOfTotalFlow[i]["count(*)"] > max)
                    max = sumOfTotalFlow[i]["count(*)"];
                if (sumOfTotalFlow[i]["count(*)"] < min)
                    min = sumOfTotalFlow[i]["count(*)"];
            };

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
                            color: "#69FFDD"
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
            self.polylines = L.layerGroup(polylineArray);
            self.polylines.addTo(map);

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
        if (context.hour > 23) {
            // clear stuff
            animationOn = false;
            this.pauseStart = false;
            clearInterval(context.animationInterval);
            return;
        } else if (context.polylines != null) {
            mapContext.removeLayer(context.polylines);
        }

        // color normal stations and selected stations
        colorSelectedStations();

        // make query getting data on rides for specified hour
        var parameters = "query=m4&hour=" + context.hour + "&date=" + date;
        d3.json("query.php?" + parameters, function (error, data) {
            if (error) {
                console.warn(error);
            };

            var polylineArray = [];
            var activeStations = [];

            // go through the data and find the stations that correspond to each trip
            for (var i = 0; i < data.length; i++) {
                var fromLatLng = [0, 0];
                var toLatLng = [0, 0];

                // quick way to add the filters
                if (filters.gender != null) {
                    if (filters.gender != data[i].gender)
                        continue;
                };

                if ((filters.age_min != null || filters.age_max != null) && isNaN(data[i].birthyear))
                    continue;
                
                if (filters.age_min != null && !isNaN(data[i].birthyear)) {
                    if ((2013 - (parseInt(data[i].birthyear))) < filters.age_min)
                        continue;
                };
                
                if (filters.age_max != null && !isNaN(data[i].birthyear)) {
                    if ((2013 - (parseInt(data[i].birthyear))) > filters.age_max)
                        continue;
                };
                
                if (filters.usertype != null) {
                    if (filters.usertype != data[i].usertype)
                        continue;
                };

                // if stations have not been selected
                if (selectedStations.length === 0) {
                    for (var q = 0; q < circles.length; q++) {
                        // from locatation
                        if (data[i]["from_station_id"] == circles[q].options.stationID) {
                            activeStations.push( circles[q]);

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
                            activeStations.push( circles[q]);

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
                }
                else{
                    for (var q = 0; q < selectedStations.length; q++) {
                        // from locatation
                        if (data[i]["from_station_id"] == selectedStations[q].options.stationID) {
                            activeStations.push( selectedStations[q]);

                            fromLatLng[0] = selectedStations[q]._latlng.lat;
                            fromLatLng[1] = selectedStations[q]._latlng.lng;

                            selectedStations[q].setStyle({
                                fillColor: "#05A2F0"
                            });
                            selectedStations[q].setStyle({
                                color: "#69FFDD"
                            });

                            // find dest no matter if its not a selected station
                            for (var w = 0; w < circles.length; w++) {
                                if (data[i]["to_station_id"] == circles[w].options.stationID) {
                                    activeStations.push( circles[w]);

                                    toLatLng[0] = circles[w]._latlng.lat;
                                    toLatLng[1] = circles[w]._latlng.lng;

                                    circles[w].setStyle({
                                        fillColor: "#F05305"
                                    });
                                    circles[w].setStyle({
                                        color: "black"
                                    });
                                };
                            };
                        }
                        // to locations
                        if (data[i]["to_station_id"] == selectedStations[q].options.stationID) {
                            activeStations.push( selectedStations[q]);

                            toLatLng[0] = selectedStations[q]._latlng.lat;
                            toLatLng[1] = selectedStations[q]._latlng.lng;

                            selectedStations[q].setStyle({
                                fillColor: "#F05305"
                            });
                            selectedStations[q].setStyle({
                                color: "#69FFDD"
                            });

                            // find from station even is its not a selected station
                            for (var w = 0; w < circles.length; w++) {
                                if (data[i]["from_station_id"] == circles[w].options.stationID) {
                                    activeStations.push( circles[w]);

                                    fromLatLng[0] = circles[w]._latlng.lat;
                                    fromLatLng[1] = circles[w]._latlng.lng;

                                    circles[w].setStyle({
                                        fillColor: "#05A2F0"
                                    });
                                    circles[w].setStyle({
                                        color: "black"
                                    });
                                };
                            };
                        };
                    };
                };

                polylineArray.push(L.polyline([fromLatLng, toLatLng], {
                        color: "orange",
                        weight: 2,
                        opacity: 1,
                    })
                    .on("click", function (target) {
                        target.target.setStyle({
                            color: "red",
                            opacity: 1
                        });;
                    })
                );       
            }; //end of for loop!

            context.polylines = L.layerGroup(polylineArray);
            context.polylines.addTo(mapContext);

            for (var i = 0; i < activeStations.length; i++) {
                activeStations[i].bringToFront();
            };

        }); // end of d3 query stuff

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

    function init(data, fill, outline, radius, mapContext, divNum) {
        divNumber = divNum;
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

                if (index > -1)
                    selectedStations.splice(index, 1);
                else
                    selectedStations.push(d.target);

                showInfo();
            });
            circles[i].on("mouseover", function (d) {
                var info = {
                    id: d.target.options.stationID,
                    name: d.target.options.stationName
                };
                stationInformation.update(info, false);
            });
        };
        colorSelectedStations();
        // add station info div
        stationInformation.addTo(mapContext);

        // get average for each stations
        for (var i = 0; i < data.length; i++) {
            (function(i){
                d3.json("query.php?query=m0&id=" + data[i].station_id, function(error, daySum) {
                    // get the total trips for each day and get average
                    if (error) {
                        console.warn(error);
                    }; 

                    var sum = 0;
                    for (var q = 0; q < daySum.length; q++) {
                        sum += parseInt(daySum[q]["count(*)"]);
                    };
                    circles[i].options.dayAvg = sum/daySum.length;
                });
            })(i);
        };
    };

    function showInfo() {
        //this is for adding/removing deselected stations
        if(windowNumber==5){
            app1.stations=[];
            app2.stations=[];
            for(var i=0;i<selectedStations.length;i++){
                app1.stations[app1.stations.length]=selectedStations[i];
                app2.stations[app2.stations.length]=selectedStations[i];
            }
            app1.setOption(null,null,null);
            app2.setOption(null,null,null);
        }
        
		if(windowNumber === 3){
	
			app1.stations = new Array(selectedStations.length);
			app2.stations = new Array(selectedStations.length);

			for(i=0; i<selectedStations.length; ++i) {
				app1.stations[i] = jQuery.extend(true, {}, selectedStations[i]);
				app2.stations[i] = jQuery.extend(true, {}, selectedStations[i]);
			}

			app1.callBack_getDemographicsData(app1);
			app2.callBack_getBikesPerDay(app2);
        }

        // color staions default 
        colorSelectedStations();

        // check to see if hover can be used again
        if (selectedStations.length == 0) {
            if (flowOn) {
                map.removeLayer(polylines);
                colorSelectedStations();
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
            // true means start
            this.pauseStart = true;
            animationOn = !animationOn;
        } else if (this.pauseStart && pause) {
            this.pauseStart = false;
        };

        // run animation
        if (animationOn && this.pauseStart && !stop) {
            animationOn = true;
            //call dataLines every 1sec
            this.animationInterval = setInterval(function () {
                dataLines(context, mapContext, date, spinner)
            }, 1000);
        }
        // pause animation
        else if (animationOn && !this.pauseStart && !stop) {
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
        // heat map of popularity 
        if (this.showPop) {
            var minMax = getMinAndMax();
            var max = minMax[1];
            var min = minMax[0];

            // heat map colors
            var heatScale = d3.scale.sqrt()
                .domain([min, max])
                .range(["#fff", "#f00"]);

            // set colors
            for (var i = 0; i < circles.length; i++) {
                var color = heatScale(circles[i].options.dayAvg);
                circles[i].setStyle({
                    fillColor: color
                });
                circles[i].setStyle({
                    color: "black"
                });
            };

            for (var i = 0; i < selectedStations.length; i++) {
                selectedStations[i].setStyle({
                    color: "#69FFDD"
                });
            };
        }
        // normal colors
        else
           colorSelectedStations();
    };

    function colorSelectedStations() {
        var context = this;
        for (var i = 0; i < circles.length; i++) {
            circles[i].setStyle({
                fillColor: "#49578E"
            });
            circles[i].setStyle({
                color: "black"
            });
        };

         // color selected stations
        for (var i = selectedStations.length - 1; i >= 0; i--) {
            selectedStations[i].setStyle({
                fillColor: "#69FFDD",
                color: "black"
            });
            selectedStations[i].bringToFront();
        };
    };

    function setWeatherInfo(wIc, pd) {
        this.weatherIcon = wIc;
        this.pickedDate = pd;
    };

    function selectStationsInside(community) {
        // format coordinates to be used in the utils library
        var poly = {
            "type": "Polygon",
            "coordinates": community.coordinates[0][0]
        };

        var communityStations = [];
        for (var i = 0; i < circles.length; i++) {
            var point = {
                "type": "Point", 
                "coordinates": [circles[i]._latlng.lng, circles[i]._latlng.lat]
            };

            if (gju.pointInPolygon(point, poly))
                communityStations.push(circles[i]);
        };

        // remove stations if all the stations in the community area are already selected
        var count = 0;
        for (var i = 0; i < communityStations.length; i++) {
            for (var q = selectedStations.length - 1; q >= 0; q--) {
                if (selectedStations[q].options.stationID == communityStations[i].options.stationID){
                    count++
                    break;
                };
            };
        };

        var remove = false;
        if (count === communityStations.length)
            remove = true;

        if (remove) {
            for (var i = 0; i < communityStations.length; i++) {
                for (var q = selectedStations.length - 1; q >= 0; q--) {
                    if (selectedStations[q].options.stationID === communityStations[i].options.stationID) {
                        selectedStations.splice(q, 1);
                    };
                };
            };
        }
        else{
            for (var i = 0; i < communityStations.length; i++) {
                var add = true;
                for (var q = selectedStations.length - 1; q >= 0; q--) {
                    console.log("I should be inside");
                    if (selectedStations[q].options.stationID === communityStations[i].options.stationID){
                        add = false;
                        break;
                    }
                };
                if (add)
                    selectedStations.push(communityStations[i]);
            };
        };

        showInfo();
    };

    function selectedStationsContainsID(ID){
        for (var i = selectedStations.length - 1; i >= 0; i--) {
            if (selectedStations[i].options.stationID === info.id)
               return true; 
        };
        return false;
    };

    // helper function for drawMap
    function getMinAndMax(){
        var max = 0;
        var min = Number.MAX_VALUE;
        for (var i = 0; i < circles.length; i++) {
            if (max < circles[i].options.dayAvg)
                max = circles[i].options.dayAvg;
            if (min > circles[i].options.dayAvg)
                min = circles[i].options.dayAvg;
        };

        return {0: min, 1:max};
    };

    stationObj.init = init;
    stationObj.getCircles = getCircles;
    stationObj.colorPop = colorPop;
    stationObj.colorDate = colorDate;
    stationObj.colorSelectedStations = colorSelectedStations;
    stationObj.setWeatherInfo = setWeatherInfo;
    stationObj.selectStationsInside = selectStationsInside;
    stationObj.getMinAndMax = getMinAndMax;
    return stationObj
};
