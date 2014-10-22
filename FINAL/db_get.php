<?php
    
    #allows the broswer to allocate enough memory for the whole database
    ini_set('memory_limit', '5000M');
    #To allow cross domain queries
    header('Access-Control-Allow-Origin: *');

    # DATABASE PARAMETERS
    $username = "root"; 
    $password = "root";   
    $host = "localhost";
    $database="divvy";

    # Connect to the database
    $server = mysql_connect($host, $username, $password);
    if (!$server) {
        die('Could not connect ');
    }
    $connection = mysql_select_db($database, $server);

    # Execute the query with respect to the parameter in the URL

    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 2
    //average bikes out for selected day of week in that station
    if(strcmp($_GET['query'], "q2a") == 0){
        $week_day=$_GET['weekday'];
        $temp = "SELECT avg(bikes) as bikes
                FROM (
                    SELECT count(*) as bikes
                    FROM divvy_trips_distances
                    WHERE weekday(starttime)='".$week_day."'";
        // FILTERS
        if($_GET['station'])
            $temp = $temp." and from_station_id = '".$_GET['station']."'";  
        if($_GET['gender'])
            $temp = $temp." and gender = '".$_GET['gender']."'";
        if($_GET['usertype'])
            $temp = $temp." and usertype = '".$_GET['usertype']."'";
        
        // end of the query
        $temp = $temp." GROUP BY day(starttime)) as Table_Alias";
    }

    //average bikes out per month
    else if(strcmp($_GET['query'], "q2b") == 0){
        $month=$_GET['month'];
        $temp = "SELECT avg(bikes) as bikes
                FROM (
                    SELECT count(*) as bikes
                    FROM divvy_trips_distances
                    WHERE month(starttime)='".$month."'";
        // FILTERS
        if($_GET['station'])
            $temp = $temp." and from_station_id = '".$_GET['station']."'";  
        if($_GET['gender'])
            $temp = $temp." and gender = '".$_GET['gender']."'";
        if($_GET['usertype'])
            $temp = $temp." and usertype = '".$_GET['usertype']."'";
        
        // end of the query
        $temp = $temp." GROUP BY day(starttime)) as Table_Alias";
    }

    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 3
    //two columns: hour of day and bikes out
    else if(strcmp($_GET['query'], "q3") == 0){
        $temp="SELECT date_format(starttime,'%l%p') as hour,avg(bikes) as num_bikes FROM (
                    SELECT starttime, count(*) AS bikes
                    FROM divvy_trips_distances
                    WHERE 1=1 ";
        // FILTERS
        if($_GET['station'])
            $temp = $temp." and from_station_id = '".$_GET['station']."'";  
        if($_GET['gender'])
            $temp = $temp." and gender = '".$_GET['gender']."'";
        if($_GET['usertype'])
            $temp = $temp." and usertype = '".$_GET['usertype']."'"; 
        if($_GET['day'])
            $temp = $temp." and day(starttime) = '".$_GET['day']."'";
        if($_GET['month'])
            $temp = $temp." and month(starttime) = '".$_GET['month']."'";

        $temp=$temp."GROUP BY hour(starttime),date(starttime)
                    ) as tablex
                GROUP BY hour(starttime);";
    }

    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 4
    //bikes out for all days of the year
    else if(strcmp($_GET['query'], "q4") == 0){
        $temp="SELECT date_format(starttime,'%b %e') as day_year,count(*) AS bikes
                FROM divvy_trips_distances
                WHERE 1=1 ";
        // FILTERS
        if($_GET['station'])
            $temp = $temp." and from_station_id = '".$_GET['station']."'";  
        if($_GET['gender'])
            $temp = $temp." and gender = '".$_GET['gender']."'";
        if($_GET['usertype'])
            $temp = $temp." and usertype = '".$_GET['usertype']."'";
        $temp=$temp."GROUP BY date(starttime);";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 6
    //distances in miles of all trips of all stations
    else if(strcmp($_GET['query'], "q6") == 0){   
        $min=$_GET['min'];
        $max=$_GET['max'];
        $temp="SELECT count(*) as bikes
        FROM divvy_trips_distances
        WHERE (meters*0.0006213) between ".$min." and ".$max;

        // FILTERS
        if($_GET['station'])
            $temp = $temp." and from_station_id = '".$_GET['station']."'";  
        if($_GET['gender'])
            $temp = $temp." and gender = '".$_GET['gender']."'";
        if($_GET['usertype'])
            $temp = $temp." and usertype = '".$_GET['usertype']."'";
        $temp=$temp.";";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 7
    else if(strcmp($_GET['query'], "q7") == 0){   
        $min=$_GET['min'];
        $max=$_GET['max'];
        $temp="SELECT count(*) as bikes
        FROM divvy_trips_distances
        WHERE (seconds / 60) between ".$min." and ".$max;

        // FILTERS
        if($_GET['station'])
            $temp = $temp." and from_station_id = '".$_GET['station']."'";  
        if($_GET['gender'])
            $temp = $temp." and gender = '".$_GET['gender']."'";
        if($_GET['usertype'])
            $temp = $temp." and usertype = '".$_GET['usertype']."'";
        $temp=$temp.";";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 8
    else if(strcmp($_GET['query'], "q8a") == 0){
        $bikeid = $_GET['bikeid'];
        $temp="SELECT bikeid as title,
	                  'Distance [mi]' as subtitle,
                      '' as ranges,
                      sum(meters)*0.0006213 as measures,
                      '' as markers
               FROM divvy_trips_distances
               WHERE bikeid = ".$bikeid."
               GROUP BY bikeid";
    }
    else if(strcmp($_GET['query'], "q8b") == 0){
        $bikeid = $_GET['bikeid'];
        $temp="SELECT bikeid as title,
	                  'Time [hrs]' as subtitle,
                      '' as ranges,
                      sum(seconds)/3600 as measures,
                      '' as markers
               FROM divvy_trips_distances
               WHERE bikeid = ".$bikeid."
               GROUP BY bikeid";
    }

	///////////////////////////////////////////////////////////////////////////
	// SECTION QUERY X (MATTHIAS)
	///////////////////////////////////////////////////////////////////////////
		
	// get gender / customer types
	else if(strcmp($_GET['query'], "qXgender") == 0){
        $temp = "SELECT gender, COUNT(*) as count
			FROM divvy_trips_distances";
		
		// FILTERS
		if($_GET['station'])
            $temp = $temp." WHERE from_station_id = '".$_GET['station']."'";  

        $temp = $temp." GROUP BY gender";
    }

    // rides per age
    else if(strcmp($_GET['query'], "qXage") == 0){   
		
		console.log("AGE QUERY");

        $temp = "SELECT birthyear, COUNT(*) as count
			FROM divvy_trips_distances
			WHERE NOT birthyear = 'Unknown' ";
		
        if($_GET['station'])
            $temp = $temp." AND from_station_id = '".$_GET['station']."'";  
        if($_GET['gender'])
            $temp = $temp." AND gender = '".$_GET['gender']."'";
        if($_GET['usertype'])
			$temp = $temp." AND usertype = '".$_GET['usertype']."'";

		$temp=$temp." GROUP BY birthyear;";
	}





    # QUERIES
    $query = $temp;
    $result = mysql_query($query);
    if (!$result) {
        die('Invalid query');
    }

    # Build the array
    $data = array();
    while($row = mysql_fetch_assoc($result)){
        #append row to data
        $data[] = $row;
    }

    echo json_encode($data);     
    mysql_close($server);
?>
