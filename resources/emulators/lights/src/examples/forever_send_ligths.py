import time
import requests
import json
import random

def getRandomSingleCommand():
    ids = ["1", "2", "3", "4", "5", "6",  "7", "8", "9"]
        

    data =dict(session='test', id=random.choice(ids), color=[random.randint(0, 255), 
    random.randint(0, 255), random.randint(0, 255)])

    return data

def foreverSingleEvent():
    while True:


        print("Sending Single")

        URL = "http://localhost:8000/setcolor"

        

        r = requests.post(url = URL, data = json.dumps(getRandomSingleCommand())) 
    
        # extracting response text  
        body = r.text 

        print("The response is:%s"%body) 
        time.sleep(0.1)


def foreverBulk():
    while True:


        print("Sending Bulk")

        URL = "http://localhost:8000/setbulk"

        
        data =dict(session='test', set=[getRandomSingleCommand() for _ in range(random.randint(1, 5))])

        r = requests.post(url = URL, data = json.dumps(data)) 
    
        # extracting response text  
        body = r.text 

        print("The response is:%s"%body) 
        time.sleep(3)

foreverSingleEvent()