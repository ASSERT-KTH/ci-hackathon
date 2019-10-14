import time
import requests
import json
import random

def getRandomSingleCommand():
    #ids = ["1", "2", "3", "4", "5", "6",  "7", "8", "9", "10", "11", "12", "13", "14", "15", "11", "12", "13"]
        

    data = dict(session='main', id=random.choice(range(1, 26)).__str__(), color=[random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)])

    return data

def foreverSingleEvent():
    while True:


        print("Sending Single")

        URL = "http://192.168.0.157:8000/setcolor"

        
        data = getRandomSingleCommand()
        print(data)
        r = requests.post(url = URL, data = json.dumps(data)) 
    
        # extracting response text  
        body = r.text 

        print("The response is:%s"%body) 
        time.sleep(0.2)


def completeColor():
    

    print("Sending Single")

    URL = "http://192.168.0.157:8000/setcolor"

    for id in range(1, 25):
    
        r = requests.post(url = URL, data = json.dumps(dict(session="main", id=id.__str__(), color=[100,100,255]))) 
    
        # extracting response text  
        body = r.text 

        print("The response is:%s"%body) 
        #time.sleep(0.001)


def blackout():
    URL = "http://192.168.0.157:8000/blackout"

        
    r = requests.post(url = URL, data = json.dumps(
        dict(session='main')
    )) 

    # extracting response text  
    body = r.text 

    print("The response is:%s"%body) 

def testOneToOne():
    while True:



        URL = "http://192.168.1.157:8000/setcolor"

        
        for i in range(1, 25):

            print("Sending Single", i)

            r = requests.post(url = URL, data = json.dumps(
                dict(session='test', id=i.__str__(), color=[255,0,0])
            )) 
        
            time.sleep(0.1)

            #r = requests.post(url = URL, data = json.dumps(
            #    dict(session='test', id=i.__str__(), color=[0,0,0])
            #)) 
        
            # extracting response text  
            body = r.text 

            print("The response is:%s"%body) 


def foreverBulk():
    while True:


        print("Sending Bulk")

        
        
        data =dict(session='test', set=[getRandomSingleCommand() for _ in range(random.randint(1, 5))])

        r = requests.post(url = URL, data = json.dumps(data)) 
    
        # extracting response text  
        body = r.text 

        print("The response is:%s"%body) 
        time.sleep(3)


def present():

    colors = [[255,191,0], [88,244,244],[255,255,0], [199,32,64]] 
    URL = "http://192.168.0.157:8000/setbulk"
    lapse = 0.4
    while True:
        blackout()

        for i in range(0, 4):
            ids = [dict(id = (i*6 + j).__str__(), color=colors[i] ) for j in range(1, 7)]
            
            data = dict(session='main', set=ids)

            print(data)
            r = requests.post(url = URL, data = json.dumps(data)) 

            body = r.text 

            print("The response is:%s"%body) 
            time.sleep(lapse)

            
        for i in range(0, 4):
            ids = [dict(id = (i*6 + j).__str__(), color=[0,0,0] ) for j in range(1, 7)]
            
            data = dict(session='main', set=ids)

            print(data)
            r = requests.post(url = URL, data = json.dumps(data)) 

            body = r.text 

            print("The response is:%s"%body) 
            time.sleep(lapse)

        
        for i in range(0, 4):
            ids = [dict(id = (i*6 + j).__str__(), color=[0,255,0] ) for j in range(1, 7)]
            
            data = dict(session='test', set=ids)

            print(data)
            r = requests.post(url = URL, data = json.dumps(data)) 

            body = r.text 

            print("The response is:%s"%body) 
        time.sleep(2*lapse)


                #r = requests.post(url = URL, data = json.dumps(
                #    dict(session='test', id=i.__str__(), color=[0,0,0])
                #)) 
            
                # extracting response text  
                

        #time.sleep(1)
#
#

present()


#def counter():

#completeColor()

#foreverSingleEvent()