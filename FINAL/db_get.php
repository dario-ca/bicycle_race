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
    if(strcmp($_GET['query'], "q2") == 0){
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

        $temp=$temp."GROUP BY hour(starttime),date(starttime)
                    ) as tablex
                GROUP BY hour(starttime);";
    }

    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 4
    //bikes out at selected date of year
    else if(strcmp($_GET['query'], "q4a") == 0){
        $date=$_GET['date'];
        $temp="SELECT count(*) AS bikes
                FROM divvy_trips_distances
                WHERE date(starttime) =".$date.";";
    }
    //bikes out for all days of the year
    else if(strcmp($_GET['query'], "q4b") == 0){
        $temp="SELECT date_format(starttime,'%b %e') as day_year,count(*) AS bikes
                FROM divvy_trips_distances
                GROUP BY date(starttime);";
    }
    
    /////////////////////////////////////////////////////////////////////////////SECTION QUERY 7
    else if(strcmp($_GET['query'], "q7") == 0){   
        $min=$_GET['min'];
        $max=$_GET['max'];
        $temp="SELECT count(*) as bikes
        FROM divvy_trips_distances
        WHERE (seconds / 60) between ".$min." and ".$max;
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