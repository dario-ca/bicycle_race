QUERIES!!

DATABASE:

trip_id, bike_id, starttime, endtime, from_station_id, to_station_id, usertype, gender, birthyear, meters, seconds

(starttime and endtime format: mm/dd/yyyy hh:mm)

FOR A C YOU NEED:
1: overall popularity of each station (number of trips from or to that station) SISTEMARE BENE QUESTA
	SELECT count(*) AS popularity
	FROM divvy_trips_distances
	WHERE from_station_id='21' OR to_station_id='21';

2: number of bikes out by day of the week (for each station and overall)
	a: SELECT count(*) AS bikes/* number of trips.. not bikes */
		FROM divvy_trips_distances
		WHERE weekday(starttime)='0'; /* 0 monday, 6 sunday */

	b: SELECT from_station_id,count(*) AS bikes
		FROM divvy_trips_distances
		WHERE weekday(starttime)='0'
		GROUP BY from_station_id
		ORDER BY from_station_id;


3: number of bikes out by hour of the day (and night) (for each station and overall)
	a:SELECT count(*) AS bikes
		FROM divvy_trips_distances
		WHERE hour(starttime)='12';

	b:SELECT count(*) AS bikes
		FROM divvy_trips_distances
		WHERE hour(starttime)= '12' AND from_station_id='73';

4: number of bikes out by day of the year
	SELECT count(*) AS bikes
	FROM divvy_trips_distances
	WHERE date(starttime) = '2013-06-27';

5: rider demographics (male vs female vs unknown, age, subscriber vs customer) (for any of the previous queries?
	hour,yearday,weekday)
	
	HOUR OF THE DAY
	a:SELECT gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE hour(starttime)='12'
	GROUP BY gender;
	b:age
	c:subscriber/customer

	DAY OF THE YEAR
	d:SELECT gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE date(starttime) = '2013-06-27'
	GROUP BY gender;
	
	e:SELECT 2014-birthyear,count(*) AS people
	FROM divvy_trips_distances
	WHERE date(starttime)='2013-06-30'
	GROUP BY birthyear;
	f:subscriber/customer

	WEEKDAY
	g:gender
	h:age
	i:subscriber/customer

	for other types of data, just GROUP BY them and SELECT them..

6: distribution of rides by distance (for each station, maybe useful for heatmaps)
	SELECT from_station_id, meters
	FROM divvy_trips_distances
	ORDER BY meters DESC;

7: distribution of rides by time (for each station, maybe useful for heatmaps)
	maybe it is not a query..but a complex chart

8: distribution of distance traveled for each bike
	SELECT bikeid,sum(meters) as tot_dist
	FROM divvy_trips_distances
	GROUP BY bikeid
	ORDER BY tot_dist DESC;

9: retrieve data in a fixed date, for that date retrieve data based upon time of day (data are number of active bike at
	that date in that hour)
	
	OVERALL
	a:SELECT count(*) AS trips
	FROM divvy_trips_distances
	WHERE hour(starttime)='12' AND date(starttime)='6/28/2013';

	EACH STATION
	b:SELECT from_station_id, count(*) AS trips
	FROM divvy_trips_distances
	WHERE hour(starttime)='12' AND date(starttime)='6/28/2013'
	GROUP BY from_station_id
	ORDER BY from_station_id DESC;

FOR A B YOU NEED TO ADD:
10: pick a station and see all (overall) outgoing trips (destinations and number of people for each of those destinations)
	SELECT from_station_id, to_station_id,count(*) AS trips
	FROM divvy_trips_distances
	WHERE from_station_id='90'
	GROUP BY to_station_id;

11: same as query number 10, but all incoming trips
	SELECT to_station_id, from_station_id,count(*) AS trips
	FROM divvy_trips_distances
	WHERE to_station_id='90'
	GROUP BY from_station_id;

12: pick a station and see demographic (gender, age, subscriber/customer) data (both for incoming and outgoing trips)
	OUTGOING
	a:SELECT gender,count(*) as people
	FROM divvy_trips_distances
	WHERE from_station_id='73'
	GROUP BY gender;
	b:age
	c:subscriber/customer


	INCOMING
	d:gender
	e:SELECT 2014-birthyear,count(*) AS people
	FROM divvy_trips_distances
	WHERE to_station_id='73'
	GROUP BY birthyear;
	f:subscriber/customer


13: break 24hours day into categories (TO DECIDE, maybe: morning, lunch time,after work, evening, night, etc..) and show
	overall flow (number of active bikes)

14: pick stations with biggest imbalance between incoming and outgoing trips, depending on time of day
	 ->this can be done through javascript, just use the query to retrieve total number of outgoing and incoming trips
	 -> OR: need to find a way to do it in sql, better
	OUTGOING
	SELECT  from_station_id,count(*)
	FROM divvy_trips_distances
	WHERE hour(starttime)='12'
	GROUP BY from_station_id;

	INCOMING
	SELECT  to_station_id,count(*)
	FROM divvy_trips_distances
	WHERE hpur(starttime)='12'
	GROUP BY to_station_id;

15: pick a community area and see number of bikes inside that are at once (based upon date and time of day...)
	->we need to find which stations are in a selected community area