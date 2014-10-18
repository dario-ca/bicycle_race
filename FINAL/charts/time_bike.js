function BulletChart2(tag, appname, titletag) {

    this.tag = tag;

    this.margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 100
    };

    d3.select(titletag).text("Total TIME per BIKE");
    d3.select(tag).append("input").attr("class", "inputnumber").attr("placeholder","Bike ID").attr("type", "number").attr("min", "1").attr("max", "5000").attr("onchange", appname + ".draw(this.value)");

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = this.canvasWidth * 0.2;
    this.draw(1);
}

BulletChart2.prototype.draw = function (bikeid) {

    var tag = this.tag;

    d3.select(tag).select("svg").remove();

    var margin = this.margin;
    var canvasWidth = this.canvasWidth;
    var canvasHeight = this.canvasHeight;

    var width = canvasWidth - margin.left - margin.right,
        height = canvasHeight - margin.top - margin.bottom;

    var chart = d3.bullet()
        .width(width)
        .height(height);

    var parameters = "query=q8b&bikeid=" + bikeid;

    d3.json("db_get.php?" + parameters, function (error, data) {
        var svg = d3.select(tag).selectAll("svg")
            .data(data)
            .enter().append("svg")
            .attr("class", "bullet")
            .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight)
            // Edit the values
            .attr("", function (d) {
                d.title = "Bike " + d.title;
                // 75 -> Bike in new (less than 400 miles)
                // 150 -> Bike in medium (less than 700 miles)
                // 250 -> Bike in old (less than 1000 miles)
                d.ranges = [75, 150, 250];
                // Value of the current selected bike
                d.measures = [d.measures];
                // Average of all the bikes
                d.markers = [90.61];
            })
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(chart);

        // AVG tick
        svg.append("text").text("All bikes AVG").attr("x", "130").attr("class", "tick").attr("transform", "translate(0,-2)");

        var title = svg.append("g")
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + height / 2 + ")");

        title.append("text")
            .attr("class", "title")
            .text(function (d) {
                return d.title;
            });

        title.append("text")
            .attr("class", "subtitle")
            .attr("dy", "1em")
            .text(function (d) {
                return d.subtitle;
            });

    });

}