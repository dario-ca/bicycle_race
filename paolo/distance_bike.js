function BulletChart1(tag, titletag) {

    this.tag = tag;

    this.margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 80
    };

    d3.select(titletag).text("Distance per BIKE");

    this.canvasWidth = document.getElementById(tag.id).clientWidth;
    this.canvasHeight = this.canvasWidth * 0.2;

}

BulletChart1.prototype.draw = function (bikeid) {
    
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

    var parameters = "query=qBike&bikeid="+bikeid;

    d3.json("db_get.php?" + parameters, function (error, data) {
        console.log(data);
        var svg = d3.select(tag).selectAll("svg")
            .data(data)
            .enter().append("svg")
            .attr("class", "bullet")
            .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight)
            // Edit the values
            .attr("", function (d) {
                d.title = "Bike " + d.title;
                d.ranges = [400, 700, 1000];
                d.measures = [d.measures];
                d.markers = [441.58];
                console.log("Ciao2");

            })
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(chart);
        
         console.log("Ciao3");

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