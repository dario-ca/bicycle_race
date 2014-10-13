<?php
    // Database param 
    $username = "root";
    $password = "root";
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

    // select the number of outgoing bikes per hour for a selected date
    else if (strcmp($_GET['query'], "m2") == 0) {
        $id = $_GET['id'];
        $date = $_GET['date'];
        $query = "SELECT hour(starttime) as hour, count(*) AS bikes
                    FROM divvy_trips_distances
                    WHERE (from_station_id=".$id
                    ." AND date(starttime)='" .$date ."') GROUP BY hour(starttime);";
    }

    else if (strcmp($_GET['query'], "m3") == 0) {
        $hour = $_GET['hour'];
        $date = $_GET['date'];
        $query = "SELECT hour(starttime) as hour, count(*) AS bikes
                    FROM divvy_trips_distances
                    WHERE (to_station_id=".$id
                    ." AND date(starttime)='" .$date ."') GROUP BY hour(starttime);";
    }

    // select the trips taken at a given hour
    else if (strcmp($_GET['query'], "m4") == 0) {
        $hour = $_GET['hour'];
        $date = $_GET['date'];
        $query = "SELECT hour(starttime) as hour, from_station_id, to_station_id 
                    FROM divvy_trips_distances WHERE (hour(starttime)=" .$hour 
                        ." AND date(starttime)='" .$date ."');";
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