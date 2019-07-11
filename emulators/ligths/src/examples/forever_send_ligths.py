import time
import requests
import json
import random

while True:


    print("Sending")

    URL = "http://localhost:8000/setcolor"

    ids = ["1", "2", "3", "4", "5"]

    data =dict(session='test', id=random.choice(ids), color=[random.randint(0, 255), 
    random.randint(0, 255), random.randint(0, 255)])

    r = requests.post(url = URL, data = json.dumps(data)) 
  
    # extracting response text  
    body = r.text 

    print("The response is:%s"%body) 
    time.sleep(1)