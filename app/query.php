<?php
    // Database param 
    $username = "carlos";
    $password = "";
    $host = "localhost";
    $database = "divvy";

    // connect to server
    $server = mysql_connect($host, $username, $password);
    if (!$server) {
        die("Could not connect to server");
    }

    // connect to db
    $conn = mysql_select_db($database);
    if (!$database) {
        die("Database: bad happened!");
    }
    
    // select the correct query
    if (strcmp($_GET['query'], "m1") == 0) {
        $query = "SELECT from_station_id, count(*) FROM divvy_trips_distances GROUP BY from_station_id;";
    }

    // execute query
    $result = mysql_query($query);
    if (!$result) {
        die("Query: bad!");
    }

    $data = array();
    while($row = mysql_fetch_assoc($result)){
        #append row to data
        $data[] = $row;
    }

    echo json_encode($data);
    mysql_close($server);

?>