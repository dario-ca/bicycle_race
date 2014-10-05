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
    if(strcmp($_GET['query'], "q0") == 0){
        $temp="SELECT * FROM divvy_trips_distances LIMIT 10;";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 1
    else if(strcmp($_GET['query'], "q1") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT count(*) AS popularity
                FROM divvy_trips_distances
                WHERE from_station_id= ".$num_station." OR to_station_id= ".$num_station.";";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 2
    else if(strcmp($_GET['query'], "q2a") == 0){
        $week_day=$_GET['weekday'];
        $temp = "SELECT count(*) AS bikes
                FROM divvy_trips_distances
                WHERE weekday(starttime)=".$week_day.";";
    }
    else if(strcmp($_GET['query'], "q2b") == 0){
        $week_day=$_GET['weekday'];
        $temp = "SELECT from_station_id,count(*) AS bikes
                FROM divvy_trips_distances
                WHERE weekday(starttime)=".$week_day.
                " GROUP BY from_station_id
                ORDER BY from_station_id;";
    }
    else if(strcmp($_GET['query'], "q2c") == 0){
        $temp="SELECT weekday(starttime), count(*) AS trips
                FROM divvy_trips_distances
                GROUP BY weekday(starttime);";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 3
    else if(strcmp($_GET['query'], "q3a") == 0){
        $hour=$_GET['hour'];
        $temp="SELECT count(*) AS bikes
        FROM divvy_trips_distances
        WHERE hour(starttime)=".$hour.";";
    }
    else if(strcmp($_GET['query'], "q3b") == 0){
        $hour=$_GET['hour'];
        $num_station=$_GET['station'];
        $temp="SELECT count(*) AS bikes
                FROM divvy_trips_distances
                WHERE hour(starttime)=".$hour." AND from_station_id=".$num_station.";";
    }
    else if(strcmp($_GET['query'], "q3c") == 0){
        $temp="SELECT hour(starttime), count(*) AS bikes
                FROM divvy_trips_distances
                GROUP BY hour(starttime);";
    }
    else if(strcmp($_GET['query'], "q3d") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT count(*) AS bikes
                FROM divvy_trips_distances
                WHERE from_station_id=".$num_station."
                GROUP BY hour(starttime);";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 4
    else if(strcmp($_GET['query'], "q4a") == 0){
        $date=$_GET['date'];
        $temp="SELECT count(*) AS bikes
                FROM divvy_trips_distances
                WHERE date(starttime) =".$date.";";
    }
    else if(strcmp($_GET['query'], "q4b") == 0){
        $temp="SELECT date(starttime),count(*) AS bikes
                FROM divvy_trips_distances
                GROUP BY date(starttime);";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 5
    else if(strcmp($_GET['query'], "q5a") == 0){
        $hour=$_GET['hour'];
        $temp="SELECT gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE hour(starttime)=".$hour.
                "GROUP BY gender;";
    }
    else if(strcmp($_GET['query'], "q5b") == 0){
        $hour=$_GET['hour'];
        $temp="SELECT 2014-birthyear,count(*) AS people
                FROM divvy_trips_distances
                WHERE hour(starttime)=".$hour.
                "GROUP BY gender;";
    }
    else if(strcmp($_GET['query'], "q5c") == 0){
        $hour=$_GET['hour'];
        $temp="SELECT usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE hour(starttime)=".$hour.
                "GROUP BY usertype;";
    }
    else if(strcmp($_GET['query'], "q5d") == 0){
        $date=$_GET['date'];
        $temp="SELECT gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE date(starttime) =".$date.
                "GROUP BY gender;";
    }
    else if(strcmp($_GET['query'], "q5e") == 0){
        $date=$_GET['date'];
        $temp="SELECT 2014-birthyear,count(*) AS people
                FROM divvy_trips_distances
                WHERE date(starttime)=".$date.
                "GROUP BY birthyear;";
    }
    else if(strcmp($_GET['query'], "q5f") == 0){
        $date=$_GET['date'];
        $temp="SELECT usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE date(starttime) =".$date.
                "GROUP BY usertype;";
    }
    else if(strcmp($_GET['query'], "q5g") == 0){
        $week_day=$_GET['weekday'];
        $temp = "SELECT gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE weekday(starttime)=".$week_day."
                GROUP BY gender;";
    }
    else if(strcmp($_GET['query'], "q5h") == 0){
        $week_day=$_GET['weekday'];
        $temp = "SELECT 2014-birthyear,count(*) AS people
                FROM divvy_trips_distances
                WHERE weekday(starttime)=".$week_day."
                GROUP BY birthyear;";
    }
    else if(strcmp($_GET['query'], "q5i") == 0){
        $week_day=$_GET['weekday'];
        $temp = "SELECT usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE weekday(starttime)=".$week_day."
                GROUP BY usertype;";
    }
    else if(strcmp($_GET['query'], "q5j") == 0){
        $temp="SELECT hour(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY hour(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5k") == 0){
        $temp="SELECT hour(starttime),count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Male'
                GROUP BY hour(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5l") == 0){
        $temp="SELECT hour(starttime),count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Female'
                GROUP BY hour(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5m") == 0){
        $temp="SELECT hour(starttime),count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Unknown'
                GROUP BY hour(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5n") == 0){
        $temp="SELECT hour(starttime),2014-birthyear AS age,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY hour(starttime),birthyear;";
    }
    else if(strcmp($_GET['query'], "q5o") == 0){
        $temp="SELECT hour(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY hour(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5p") == 0){
        $temp="SELECT hour(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE usertype='Customer'
                GROUP BY hour(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5q") == 0){
        $temp="SELECT hour(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE usertype='Subscriber'
                GROUP BY hour(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5r") == 0){
        $temp="SELECT date(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY date(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5s") == 0){
        $temp="SELECT date(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Male'
                GROUP BY date(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5t") == 0){
        $temp="SELECT date(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Female'
                GROUP BY date(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5u") == 0){
        $temp="SELECT date(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Unknown'
                GROUP BY date(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5v") == 0){
        $temp="SELECT date(starttime),2014-birthyear AS age,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY date(starttime),birthyear;";
    }
    else if(strcmp($_GET['query'], "q5w") == 0){
        $temp="SELECT date(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY date(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5x") == 0){
        $temp="SELECT date(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE usertype='Customer'
                GROUP BY date(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5y") == 0){
        $temp="SELECT date(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE usertype='Subscriber'
                GROUP BY date(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5z") == 0){
        $temp="SELECT weekday(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY weekday(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5aa") == 0){
        $temp="SELECT weekday(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Male'
                GROUP BY weekday(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5ab") == 0){
        $temp="SELECT weekday(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Female'
                GROUP BY weekday(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5ac") == 0){
        $temp="SELECT weekday(starttime),gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE gender='Unknown'
                GROUP BY weekday(starttime),gender;";
    }
    else if(strcmp($_GET['query'], "q5ad") == 0){
        $temp="SELECT weekday(starttime),2014-birthyear AS age,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY weekday(starttime),birthyear;";
    }
    else if(strcmp($_GET['query'], "q5ae") == 0){
        $temp="SELECT weekday(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                GROUP BY weekday(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5af") == 0){
        $temp="SELECT weekday(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE usertype='Customer'
                GROUP BY weekday(starttime),usertype;";
    }
    else if(strcmp($_GET['query'], "q5ag") == 0){
        $temp="SELECT date(starttime),usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE usertype='Subscriber'
                GROUP BY date(starttime),usertype;";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 6
    else if(strcmp($_GET['query'], "q6") == 0){   
        $temp="SELECT from_station_id, meters
        FROM divvy_trips_distances
        ORDER BY meters DESC;";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 7: TO DO
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 8
    else if(strcmp($_GET['query'], "q8") == 0){   
        $temp="SELECT bikeid,sum(meters) AS tot_dist
                FROM divvy_trips_distances
                GROUP BY bikeid
                ORDER BY tot_dist DESC;";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 9
    else if(strcmp($_GET['query'], "q9a") == 0){
        $date=$_GET['date'];
        $hour=$_GET['hour'];
        $temp="SELECT count(*) AS trips
                FROM divvy_trips_distances
                WHERE hour(starttime)=".$hour." AND date(starttime)=".$date.";";
    }
    else if(strcmp($_GET['query'], "q9b") == 0){
        $date=$_GET['date'];
        $hour=$_GET['hour'];
        $temp="SELECT from_station_id, count(*) AS trips
                FROM divvy_trips_distances
                WHERE hour(starttime)=".$hour." AND date(starttime)=".$date.
                "GROUP BY from_station_id
                ORDER BY from_station_id DESC;";
    }
    else if(strcmp($_GET['query'], "q9c") == 0){
        $date=$_GET['date'];
        $temp="SELECT hour(starttime) AS hour,count(*) AS trips
                FROM divvy_trips_distances
                WHERE date(starttime)=".$date."
                GROUP BY hour(starttime);";
    }
    else if(strcmp($_GET['query'], "q9d") == 0){
        $date=$_GET['date'];
        $num_station=$_GET['station'];
        $temp="SELECT hour(starttime) AS hour,count(*) AS trips
                FROM divvy_trips_distances
                WHERE date(starttime)=".$date." AND from_station_id=".$num_station."
                 GROUP BY hour(starttime);";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 10
    else if(strcmp($_GET['query'], "q10") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT from_station_id, to_station_id,count(*) AS trips
            FROM divvy_trips_distances
            WHERE from_station_id=".$num_station."
            GROUP BY to_station_id;";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 11
    else if(strcmp($_GET['query'], "q11") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT to_station_id, from_station_id,count(*) AS trips
            FROM divvy_trips_distances
            WHERE to_station_id=".$num_station."
            GROUP BY from_station_id;";
    }
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 12
    else if(strcmp($_GET['query'], "q12a") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE from_station_id=".$num_station."
                GROUP BY gender;";
    }
    else if(strcmp($_GET['query'], "q12b") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT 2014-birthyear,count(*) AS people
                FROM divvy_trips_distances
                WHERE from_station_id=".$num_station."
                GROUP BY birthyear;";
    }
    else if(strcmp($_GET['query'], "q12c") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE from_station_id=".$num_station."
                GROUP BY usertype;";
    }
    else if(strcmp($_GET['query'], "q12d") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT gender,count(*) AS people
                FROM divvy_trips_distances
                WHERE to_station_id=".$num_station."
                GROUP BY gender;";
    }
    else if(strcmp($_GET['query'], "q12e") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT 2014-birthyear,count(*) AS people
                FROM divvy_trips_distances
                WHERE to_station_id=".$num_station."
                GROUP BY birthyear;";
    }
    else if(strcmp($_GET['query'], "q12e") == 0){
        $num_station=$_GET['station'];
        $temp="SELECT usertype,count(*) AS people
                FROM divvy_trips_distances
                WHERE to_station_id=".$num_station."
                GROUP BY usertype;";
    }
    //////////////////////////////////////////////////////////////////SECTION QUERY FROM 13: TO DO

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