DATABASE:
trip_id, bike_id, starttime, endtime, from_station_id, to_station_id, usertype, gender, birthyear, meters, seconds

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
		WHERE weekday(starttime)='0' and from_station_id = '5';

	/* this is better for a graph, it gives both x-axis and y-axis*/
	c:SELECT weekday(starttime), count(*) AS trips
		FROM divvy_trips_distances
		GROUP BY weekday(starttime);


3: number of bikes out by hour of the day (and night) (for each station and overall)
	a:SELECT count(*) AS bikes
		FROM divvy_trips_distances
		WHERE hour(starttime)='12';

	b:SELECT count(*) AS bikes
		FROM divvy_trips_distances
		WHERE hour(starttime)= '12' AND from_station_id='73';

	/*c and b are better for graphs*/
	c:SELECT hour(starttime), count(*) AS bikes
		FROM divvy_trips_distances
		GROUP BY hour(starttime);
	
	d:SELECT hour(starttime),count(*) AS bikes
                FROM divvy_trips_distances
                WHERE from_station_id='73'
                GROUP BY hour(starttime);

4: number of bikes out by day of the year
	a:SELECT count(*) AS bikes
	FROM divvy_trips_distances
	WHERE date(starttime) = '2013-06-27';

	/*better for graphs*/
	b:SELECT date(starttime),count(*) AS bikes
	FROM divvy_trips_distances
	GROUP BY date(starttime);

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


	/*better for graphs*/
	HOUR OF DAY
	GENDER
	j:SELECT hour(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY hour(starttime),gender;

	k:SELECT hour(starttime),count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Male'
	GROUP BY hour(starttime),gender;

	l:SELECT hour(starttime),count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Female'
	GROUP BY hour(starttime),gender;
	
	m:SELECT hour(starttime),count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Unknown'
	GROUP BY hour(starttime),gender;

	AGE
	n:SELECT hour(starttime),2014-birthyear AS age,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY hour(starttime),birthyear;

	USERTYPE
	o:SELECT hour(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY hour(starttime),usertype;

	p:SELECT hour(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	WHERE usertype='Customer'
	GROUP BY hour(starttime),usertype;

	q:SELECT hour(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	WHERE usertype='Subscriber'
	GROUP BY hour(starttime),usertype;

	DAY OF YEAR
	GENDER
	r:SELECT date(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY date(starttime),gender;

	s:SELECT date(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Male'
	GROUP BY date(starttime),gender;

	t:SELECT date(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Female'
	GROUP BY date(starttime),gender;

	u:SELECT date(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Unknown'
	GROUP BY date(starttime),gender;

	AGE
	v:SELECT date(starttime),2014-birthyear AS age,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY date(starttime),birthyear;

	USERTYPE
	w:SELECT date(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY date(starttime),usertype;

	x:SELECT date(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	WHERE usertype='Customer'
	GROUP BY date(starttime),usertype;

	y:SELECT date(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	WHERE usertype='Subscriber'
	GROUP BY date(starttime),usertype;

	WEEKDAY
	GENDER
	z:SELECT weekday(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY weekday(starttime),gender;

	aa:SELECT weekday(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Male'
	GROUP BY weekday(starttime),gender;

	ab:SELECT weekday(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Female'
	GROUP BY weekday(starttime),gender;

	ac:SELECT weekday(starttime),gender,count(*) AS people
	FROM divvy_trips_distances
	WHERE gender='Unknown'
	GROUP BY weekday(starttime),gender;

	AGE
	ad:SELECT weekday(starttime),2014-birthyear AS age,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY weekday(starttime),birthyear;

	USERTYPE
	ae:SELECT weekday(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	GROUP BY weekday(starttime),usertype;

	af:SELECT weekday(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	WHERE usertype='Customer'
	GROUP BY weekday(starttime),usertype;

	ag:SELECT date(starttime),usertype,count(*) AS people
	FROM divvy_trips_distances
	WHERE usertype='Subscriber'
	GROUP BY date(starttime),usertype;

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
        WHERE hour(starttime)='12' AND date(starttime)='2013-06-27';

	EACH STATION
	b:SELECT from_station_id, count(*) AS trips
                FROM divvy_trips_distances
                WHERE hour(starttime)='12' AND date(starttime)='2013-06-27'
                GROUP BY from_station_id
                ORDER BY from_station_id DESC;

	/* better for graphs*/
	c:SELECT hour(starttime) AS hour,count(*) AS trips
	FROM divvy_trips_distances
	WHERE date(starttime)='2013-06-27'
	GROUP BY hour(starttime);
	
	d:SELECT hour(starttime) AS hour, count(*) AS trips
	FROM divvy_trips_distances
	WHERE date(starttime)='2013-06-27' AND from_station_id='73'
	GROUP BY hour(starttime);



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