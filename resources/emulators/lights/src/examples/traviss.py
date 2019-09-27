import websocket
import time
import requests
import json
import random

from json import loads

jobs = [None]*26

def getEmpty():
    for index,j in enumerate(jobs):
        if not j:
            return index + 1
    return None

def getJobBySha(sha):
    for index, j in enumerate(jobs):
        if j and j["key"] == sha:
            return index + 1, j
    return None

def color_by_status(data):
    state = data["state"]

    if state == 'finished':
        return [255, 225 , 0]

    if state == 'errored':
        return [255, 0 , 0]
    
    if state == 'failed':
        return [255, 0 , 0]
    
    if state == 'passed':
        return [0, 255 , 0]

    return [0,0,0]

def on_message(ws, message):
    URL = "https://ci-lights.azurewebsites.net/setcolor"

    
    obj = loads(message)

    key = obj["data"]["commit"]["sha"]

    if obj["data"]["state"] == "started":
        id = getEmpty()

        if id:
            jobs[id - 1] = dict(key=key, color=[0,0,255], id=id-1)
            print(id, key, "Joining")

            r = requests.post(url = URL, data = json.dumps(
                dict(session='main', id=id.__str__(), color=[0,0,255])
            )) 
        else:
            dc = random.choice(jobs)
            if dc:
                r = requests.post(url = URL, data = json.dumps(
                    dict(session='main', id=dc["id"].__str__(), color=[200,200,0]
                )))

                time.sleep(0.3)

                r = requests.post(url = URL, data = json.dumps(
                    dict(session='main', id=dc["id"].__str__(), color=dc["color"]
                )))
    
    else:
     #(message.data.state === "finished" || message.data.state === "errored" || message.data.state === "failed" || message.data.state === "passed")
        dc = random.choice(jobs)

        if dc:
            r = requests.post(url = URL, data = json.dumps(
                dict(session='main', id=dc["id"].__str__(), color=color_by_status(obj["data"])
            )))

            time.sleep(0.3)

            r = requests.post(url = URL, data = json.dumps(
                dict(session='main', id=dc["id"].__str__(), color=dc["color"]
            )))
        




def blackout():
    URL = "https://ci-lights.azurewebsites.net/setcolor"

        
    for i in range(1, 26):

        print("Sending Single", i)

        
        r = requests.post(url = URL, data = json.dumps(
            dict(session='main', id=i.__str__(), color=[0,0,0])
        )) 
    
        # extracting response text  
        body = r.text 

        print("The response is:%s"%body) 

blackout()
websocket.enableTrace(True)
ws = websocket.WebSocketApp("wss://travis.durieux.me/",on_message = on_message)
ws.run_forever()