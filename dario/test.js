function foo(){
	
	//example: it is enough to build the string of the file to open, passing parameters about the query needed
	var query="q1";
	var station=73;
	var to_open="db_get.php?query="+query+"&station="+station;
	
	d3.json("db_get.php?query=q0", function(error, data) {
		    data.forEach(function(d) {
		        console.log(d)
	    	});	
	});
}