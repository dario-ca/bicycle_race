function foo(){
	d3.json("db_get.php?query=q1", function(error, data) {
		    data.forEach(function(d) {
		        console.log(d)
	    	});	
	});
}