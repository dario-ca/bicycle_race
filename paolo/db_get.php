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
    if(strcmp($_GET['query'], "q1") == 0){
        $temp = "SELECT * FROM divvy_trips_distances WHERE meters > 15000";
    }
    else{
        $temp = "SELECT * FROM divvy_trips_distances WHERE meters < 500";
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