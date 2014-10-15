#!/usr/bin/python
import csv
import datetime as dt
import dateutil.parser as dparser

def edit_file(sourceFile, date, destFile = "csv_edited/weather.csv"):

    rdr = csv.reader(open(sourceFile, "r"), delimiter=',')
    with open(destFile, "a") as result:
        wtr = csv.writer(result, delimiter=',')
        # Skip the first 2 lines (it's empty)
        rdr.next()
        rdr.next()
        for r in rdr:
            datetime = dparser.parse(str(date)+" "+r[0])
            wtr.writerow((datetime, r[1], r[3], r[5], r[7], r[9], r[11]))


    print("Done: "+ destFile)

def main():

    start_date = dt.datetime(2013, 6, 27)
    end_date = dt.datetime(2013, 12, 31)

    total_days = (end_date - start_date).days + 1 #inclusive 5 days

    for day_number in range(total_days):
        current_date = (start_date + dt.timedelta(days = day_number)).date()
        sourceFolder = "csv_data/"
        filename = str(current_date.year) + "-" + str(current_date.month) + "-" + str(current_date.day) + ".csv"
        edit_file(sourceFolder + filename ,  current_date)

if __name__ == "__main__":
    main()