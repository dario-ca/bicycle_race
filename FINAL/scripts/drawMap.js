function drawMap() {
	
	console.log("\t- Draw Map");

    // globals
	var map;
    var mapArea;
    var divvyCircles;

    // function object
    var BikeMap = new Object();

    function init(){
        map = L.map('map').setView([41.9, -87.7], 12);
        mapArea = $('#map');
        divvyCircles = new DivvyCircles();

        // chicago geoJson and add layers
        d3.json("data/chicagoDist.json", function(data){
                //read in divvy bike location
                d3.csv("data/stations.csv", function(stations){
                divvyCircles.addData(stations, "grey", "black", 5);
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
                            color: "#17D576",
                            // colorOpacity: 1,
                            fillColor: "grey",
                            fillOpacity: 0.25,
                            opacity: 1
                        };
                    },
                    onEachFeature: function (feature, layer){
                        layer.bindPopup(feature.properties.name);
                        layer.on('click', function (){
                            testStuff(feature.properties.name)}
                        );
                    }
                })
            };

            // add control and streets layer and bicycle stations
           
            // removed minimaps :(
            // var layersControl = L.control.layers.minimap(baseLayers, overlays, {
            //     collapsed: false
            // }).addTo(map);
            L.control.layers(baseLayers, overlays).addTo(map);
            baseLayers['Streets'].addTo(map);

            for (var i = 0; i < stationCircles.length; i++)
                stationCircles[i].addTo(map);
        };
    };

    // future function here
    function testStuff(name){
        console.log(name);
    };

    // color stations depending on options
    // 1: heatmap
    function coloStations (option, date) {
        if (divvyCircles == undefined) {
            console.log("divvyCircles object is not defined, did init get called?");
            return;
        };

        // heatmap
        if (option == 1) {
            divvyCircles.colorPop();
        }
        // Date station traffic
        else if (option == 2) {
            divvyCircles.colorDate(date, map);
        };
    };

    BikeMap.init = init;
    BikeMap.colorStations = coloStations;
    return BikeMap;
}

BikeMap = new drawMap();
