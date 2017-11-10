import requests
import json
import os.path

DEST = "./app/dist/api/"

for rtype in [0, 1]:
    r = requests.get ('https://sailaway.world/cgi-bin/sailaway/GetMissions.pl?race=1&tutorial=0&hist=1&racetype=' + str (rtype))
    try:
        data = r.json ()
    except:
        continue
    f = open (DEST + 'races_' + str (rtype) + '.json', 'w')
    f.write (json.dumps (data))
    f.close ()

    for race in data['missions']:
        rid = race['misnr']
        hours = int (race['hours'])

        if hours < -700:
            continue

        print ('Getting', rid)
        r = requests.get ('https://sailaway.world/cgi-bin/sailaway/GetLeaderboard.pl?misnr=' + str (rid))
        try:
            data = r.json ()
            f = open (DEST + 'leaderboard_' + str (rid) + '.json', 'w')
            f.write (json.dumps (data))
            f.close ()
            print ('Saved leadboard')
        except:
            pass
            
        if not os.path.isfile (DEST + 'race_' + str (rid) + '.json'):
            try:
                SESSIONID = open ('SESSIONID', 'r').read ()
            except:
                SESSIONID = ""
                
            r = requests.get ('https://sailaway.world/cgi-bin/sailaway/GetMission.pl?misnr=' + str (rid), cookies=dict(CGISESSID=SESSIONID))

            try:
                data = r.json ()
                f = open (DEST + 'race_' + str (rid) + '.json', 'w')
                f.write (json.dumps (data))
                f.close ()
                print ('Saved race')
            except:
                pass
