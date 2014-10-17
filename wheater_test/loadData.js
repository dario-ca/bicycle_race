function WeatherForecast(tag) {

    this.tag = tag;
    this.callBack_getWeather(this);
    this.values = [];

    this.iconBoxId = "weatherIconBox";
    this.iconId = "weatherIcon";
    
    this.tempVal = "tempVal";
    
    this.draw(null,null);
}

WeatherForecast.prototype.draw = function (dateParameter) {

    var dateParameter = new Date(dateParameter);
    var month = dateParameter.getMonth();
    var day = dateParameter.getDate();
    var hour = dateParameter.getHours();

    var box = d3.select(this.tag);

    box.select("#"+this.iconBoxId).remove();
    box.append("div").attr("id", this.iconBoxId);

    var iconBox = d3.select("#" + this.iconBoxId);

    for (i = 0; i < this.values.length; i++) {
        var value = this.values[i];
        var date = new Date(value.datetime);

        // Display Infos
        if (date.getMonth() == month && date.getDate() == day && date.getHours() == hour) {
            var imageName = getImage(value.conditions, date.getHours());
            iconBox.append("img").attr("id", this.iconId).attr("src", "weather_icons/" + imageName);
            d3.select("#"+this.tempVal).text(value.temperatureF+" F");
            console.log("The conditions on date " + value.datetime + " are " + value.conditions);
        }
    }

}

/*Load all the dates+hours into memory*/
WeatherForecast.prototype.callBack_getWeather = function (context) {

    d3.csv("weather.csv", function (error, data) {
        data.forEach(function (d) {
            var date = new Date(d.datetime);
            context.values.push(d);
            // To populate the dropdown menu
            d3.select("#dropdown").append("option").attr("value", date).text(date);
        });
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