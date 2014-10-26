function drawMap() {
	
	console.log("\t- Draw Map");

    // globals
	var map;
    var mapArea;
    var divvyCircles;
    var date;
    var weatherIcon;

    // function object
    var BikeMap = new Object();

    // boolean globals
    var heatmap = false;
    var legendOn = false;
    
    // dom elements and controls
    var legend = L.control({position: 'bottomleft'});
    var animationControl = L.control({position: 'bottomleft'});
    var heatButton = L.control({position: "bottomleft"});
    var weather = L.control({position: "topright"});

    // dom buttons init functions
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div', 'legend');  //create div elelemt
        var minMax = divvyCircles.getMinAndMax();
        var min = parseInt(minMax[0]);
        var max = parseInt(minMax[1]);
        var grades = [min, min + ((max-min)/4), (max-min)/2, max - ((max-min)/4), max],
            labels = [];

        // heat map colors
        var heatScale = d3.scale.sqrt()
        .domain([min, max])
        .range(["#fff", "#f00"]);

        div.innerHTML += '<p>Daily Average:<p><hr><br>';
        for (var i = grades.length-1; i > 0; i--) {
            div.innerHTML +=
                '<i style="background:' + heatScale(grades[i-1]) + '"></i> ' + '<p>' +
                grades[i - 1] + (grades[i-1] ? '&ndash;' + grades[i] + '</p><br>' : '-');
        };

        return div;
    };

    animationControl.onAdd = function(map){
        var div = L.DomUtil.create('div', 'animationControl');
        div.innerHTML = '<p> <input id=\"hourChooser\" name=\"value\"> </p>' + 
            '<i id="pause" style="background:' + "green" + '"></i> <i id="close" style="background:' + "red" + '"></i>';
        return div;
    };

    heatButton.onAdd = function(map){
        var div = L.DomUtil.create('div', 'heatButtonWrapper');
        div.innerHTML = "<input type=\"button\" id=\"heatButton\" value=\"Popularity\" />";
        return div;
    }
    
    weather.onAdd = function(map){
        var div = L.DomUtil.create('div', 'weatherWrapper');
        div.innerHTML = "<div id=\"tempBox\"><div id=\"textBox\"><p id=\"tempPar\" style=\"color: black; font-weight: bold;\"></p></div></div><div id=\"weatherIconBox\"></div>";
        return div;
        
        /*
        <div id="tempBox">
            <div id="textBox">
                <p id="tempPar">Temperature</p>
            </div>
        </div>
        <div id="weatherIconBox">
            <img id="weatherIcon" src="weather_icons/Unknown.png">
        </div>
        */
    }
    // end of buttons init code

    // init function for object
    function init(div){
        map = L.map(div, {zoomControl: false}).setView([41.9, -87.65], 12);
        mapArea = $(div);
        divvyCircles = new DivvyCircles();

        // chicago geoJson and add layers
        d3.json("data/chicagoDist.json", function(data){
                //read in divvy bike location
                d3.csv("data/stations.csv", function(stations){
                divvyCircles.init(stations, "grey", "black", 5, map);
                addLayers(data, divvyCircles.getCircles());
            });
        });

        // shitty work around because Javascript is stupid sometimes
        function addLayers(chicagoMap, stationCircles){
            // tile layers
            var baseLayers = {
                'Streets' : L.tileLayer('http://{s}.tiles.mapbox.com/v3/dare2wow.jkic38a8/{z}/{x}/{y}.png', {
                        attribution: 'Tiles Courtesy of <a href="http://www.mapbox.com/">Mapbox</a>;',
                        maxZoom: 18,
                        minZoom: 10
                    }),

                'MapQuest Aerial': L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
                        attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a>',
                        subdomains: '1234',
                        maxZoom: 18,
                        minZoom: 10
                })
            };

            // map overlays
            var overlays = {
                'Chicago Communities' : L.geoJson(chicagoMap, {
                    style: function (feature){
                        return {
                            color: "#A669FF",
                            // colorOpacity: 1,
                            fillColor: "white",
                            fillOpacity: 0.25,
                            opacity: 1,
                            weight: 2
                        };
                    },
                    onEachFeature: function (feature, layer){
                        layer.bindPopup(feature.properties.name);
                        layer.on('click', function (){
                            findStationsInside(feature.geometry);
                        });
                    }
                })
            };

            // add control and streets layer and bicycle stations
            // removed minimaps :(
            // var layersControl = L.control.layers.minimap(baseLayers, overlays, {
            //     collapsed: false
            // }).addTo(map);

            L.control.layers(baseLayers, overlays, {position: 'bottomright'}).addTo(map);
            baseLayers['Streets'].addTo(map);

            for (var i = 0; i < stationCircles.length; i++)
                stationCircles[i].addTo(map);

            // add heatbutton
            heatButton.addTo(map);
            weather.addTo(map);
            $('#heatButton').click( function(){
                BikeMap.colorStations(1)}
            );
        };
    };

    // future function here
    function findStationsInside(community){
        divvyCircles.selectStationsInside(community);
    };

    // color stations depending on options
    // 1: heatmap
    // 2: date
    function coloStations (option, pickedDate) {
        if (divvyCircles == undefined) {
            console.log("divvyCircles object is not defined, did init get called?");
            return;
        };

        // heatmap
        if (option == 1) {
            heatmap = !heatmap
            // add/remove legend
            if (heatmap) {
                legend.addTo(map)
                legendOn = !legendOn;
            }
            else{
                legend.removeFrom(map);
                legendOn = !legendOn;
            };
            divvyCircles.colorPop();
        }
        // Date station traffic
        else if (option == 2) {
            // remove legend and heat button
            date = pickedDate;
            switchButtons(2);

            console.log(date);

            divvyCircles.colorDate(date, 0, false, map, $( "#hourChooser" ));
        };
    };

    // helper function for switching buttons
    function switchButtons(toWhat){
        if (toWhat == 1) {
            animationControl.removeFrom(map);

            // add heatbutton
            heatButton.addTo(map);
            $('#heatButton').click( function(){
                BikeMap.colorStations(1)}
            );

            legendOn = false;
            heatmap = false;
        }

        else if (toWhat == 2) {
            heatButton.removeFrom(map);
            if (legendOn){
                legend.removeFrom(map);
                divvyCircles.colorSelectedStations();
            }

            // add controls
            animationControl.addTo(map);
            var spinner = $( "#hourChooser" ).spinner();
            // $("#spinner").spinner({ numberFormat: "d2" });
            $( "#hourChooser" ).spinner( "option", "max", 23 );
            $( "#hourChooser" ).spinner( "option", "min", 0 );

            // add the listners
            $('.ui-spinner-button').click(function (){
                divvyCircles.colorDate(date, $( "#hourChooser" ).spinner("value"), false, map, $("#hourChooser"), false);
            });
            $('#pause').click(function (){
                divvyCircles.colorDate(date, $( "#hourChooser" ).spinner("value"), true, map, $("#hourChooser"), false);
            });
            $('#close').click(function (){
                divvyCircles.colorDate(date, $( "#hourChooser" ).spinner("value"), false, map, $("#hourChooser"), true);
                divvyCircles.colorSelectedStations();
                console.log("Hello");
                switchButtons(1); 
            });
        };
    }
    
    function setWeatherIcon(wIc, dateVal){
        weatherIcon = wIc;
        var pickedDate = new Date(dateVal);
        pickedDate.setDate(pickedDate.getDate()+1);
        pickedDate.setHours(0);
        weatherIcon.draw(pickedDate);
        divvyCircles.setWeatherInfo(weatherIcon, pickedDate);
    }

    BikeMap.init = init;
    BikeMap.colorStations = coloStations;
    BikeMap.setWeatherIcon = setWeatherIcon;
    return BikeMap;
};
