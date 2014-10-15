__author__ = 'paolobruzzo'

import urllib2
import datetime as dt


def getPage(url):
    response = urllib2.urlopen(url)
    html = response.read()
    html = html.replace("<br />", "")
    return html

def main():

    start_date = dt.datetime(2013, 6, 27)
    end_date = dt.datetime(2013, 12, 31)

    total_days = (end_date - start_date).days + 1 #inclusive 5 days

    for day_number in range(total_days):
        current_date = (start_date + dt.timedelta(days = day_number)).date()

        urlDate = str(current_date.year)+"/"+str(current_date.month)+"/"+str(current_date.day)
        folder = "csv_data/"
        filenameDate = str(current_date.year)+"-"+str(current_date.month)+"-"+str(current_date.day)+".csv"

        print "Saving "+filenameDate
        csvFile = getPage('http://www.wunderground.com/history/airport/KMDW/'+urlDate+'/DailyHistory.html?req_city=NA&req_state=NA&req_statename=NA&format=1')

        f = open(folder+filenameDate,'w+')
        f.write(csvFile)
        f.close()


if __name__ == "__main__":
    main()