/* - Tag is the div where to place the weather icon
   - temperatureBox is the div where to place the temperature value*/
function WeatherForecast(tag, temperatureBox) {

    this.tag = tag;
    this.values = [];
    this.callBack_getWeather(this);

    this.iconId = "weatherIcon";
    this.tempVal = temperatureBox;
}

/* Pass the full date in input (yyyy-MM-dd hh:mm:ss), and the icon and temp will be drawn.
   EX: 2013-08-12 12:51:00 */
WeatherForecast.prototype.draw = function (dateParameter) {

    var dateParameter = new Date(dateParameter);
    var month = dateParameter.getMonth();
    var day = dateParameter.getDate();
    var hour = dateParameter.getHours();

    var box = d3.select(this.tag);

    box.selectAll("*").remove();

    for (i = 0; i < this.values.length; i++) {
        var value = this.values[i];
        var date = new Date(value.datetime);
        // Display Infos
        if (date.getMonth() == month && date.getDate() == day && date.getHours() == hour) {
            var imageName = getImage(value.conditions, date.getHours());
            box.append("img").attr("id", this.iconId).attr("src", "img/weather_icons/" + imageName);
            // Escape ° symbol
            d3.select("#"+this.tempVal).html(value.temperatureF+" &#x00b0;F");
        }
    }
}

/*Load all the dates+hours into memory*/
WeatherForecast.prototype.callBack_getWeather = function (context) {

    d3.csv("data/weather.csv", function (error, data) {
        data.forEach(function (d) {
            var date = new Date(d.datetime);
            context.values.push(d);
        });
        //context.draw("2013-12-08 11:00:00");
    });
}


/*=========================================
        UTILS
===========================================*/

// Returns the image filename with respect to conditions and time
function getImage(conditions, time) {
    
    // Icon files properties, don't touch
    var ext = ".png";
    var day = "_day";
    var night = "_night";

    // Separators between day and night
    var sunrise = 6;
    var sunset = 19;

    switch (conditions) {
            
        // Icons which differ from day to night
        case "Clear":
        case "Light Drizzle":
        case "Light Rain":
        case "Mostly Cloudy":
        case "Partly Cloudy":
        case "Scattered Clouds":
        case "Thunderstorm":
            if (time >= sunrise && time < sunset)
                return conditions + day + ext;
            return conditions + night + ext;

        // Common icons
        case "Drizzle":
        case "Fog":
        case "Haze":
        case "Heavy Drizzle":
        case "Heavy Rain":
        case "Heavy Thunderstorms and Rain":
        case "Light Freezing Drizzle":
        case "Light Snow":
        case "Light Thunderstorms and Rain":
        case "Overcast":
        case "Rain":
        case "Smoke":
            return conditions + ext;

        default:
            return "Unknown" + ext;
    }

}