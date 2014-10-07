__author__ = 'Paolo Bruzzo'

import csv

# Read the already formatted sql file
f = open("stations.sql", "r")
string = f.read()
no_peak = ""

# Remove all the pointless characters
for c in string:
    if c != "'" and c != "(" and c != ")":
        no_peak += c

i = 0
record = ["", "", "", ""]

# Open the csv file to write
with open("stations.csv", "wb") as result:
    wtr = csv.writer(result, delimiter=',')
    # Write the titles
    wtr.writerow(["station_id", "station_name", "latitude", "longitude"])
    # Parse the resulting string and write each record
    for c in no_peak:
        if c == ",":
            i += 1
        else:
            record[i] += c
        if i == 4:
            print "Writing: "+ str(record)
            wtr.writerow(record)
            record[0] = ""
            record[1] = ""
            record[2] = ""
            record[3] = ""
            i = 0

# Close the file
result.close()
