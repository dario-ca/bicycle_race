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

    #q0 is for trying...remove it
    if(strcmp($_GET['query'], "qBike") == 0){
        $bikeid = $_GET['bikeid'];
        $temp="SELECT bikeid as title,
	                  'Distance [mi]' as subtitle,
                      '' as ranges,
                      sum(meters)*0.0006213 as measures,
                      '' as markers
               FROM divvy.divvy_trips_distances
               WHERE bikeid = ".$bikeid."
               GROUP BY bikeid";
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