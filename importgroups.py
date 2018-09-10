import csv
import json

with open('2018-19 Project Groups - Sheet1.csv', newline='') as csv_file:
    reader = csv.reader(csv_file)
    rows = [
               row
               for row in reader
               if row[1]
           ][1:]

registeredTeams = [{
    "email": row[1].strip(),
    "team": [
        usn.strip()
        for usn in row[2:]
        if usn.strip()
    ],
    "registered": 0
} for row in rows]

json.dump(registeredTeams, open('teams.json', 'w'), indent=2)
