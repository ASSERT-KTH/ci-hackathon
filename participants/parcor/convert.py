import json
import time
import datetime
import sys

#json_data = '{"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}'

#parsed_json = (json.loads(json_data))

#print(json.dumps(parsed_json, indent=4, sort_keys=True))

#loaded_json = json.loads(json_data)
#for x in loaded_json:
#	print("%s: %d" % (x, loaded_json[x]))

#class Commit(object):
#    def __init__(self, data):
#	    self.__dict__ = json.loads(data)

#test1 = Commit(json_data)

#for x in test1.__dict__:
#    print ("%s: %d" % (x, test1[x]))

#with open('testdata.json', 'r') as f:
i = 0 
for row in sys.stdin:
    #if (i == 1):
    #    break

    try:
    commit = json.loads(row)

    #j = 0  
        for c in commit:
            if "date" in c:
                commit[c] = int(time.mktime(datetime.datetime.strptime(commit[c], "%a, %d %b %Y %H:%M:%S %z").timetuple())) % 1000000
            else:
                commit[c] =  commit[c].__hash__() % 1000000
        
            