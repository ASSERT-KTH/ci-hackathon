
'''
    Map layout

    "id": {
        "dmxId": number,
        "relativePosition": [0-1, 0-1, 0 - 1] -> [x, y, z (depth)]
        "color": [0,0,0] initial color black
    }
'''

def initLightMap(dmxId, position):

    return {
        "dmxId": dmxId,
        "relativePosition": position,
        "color": [0,0,0]
    }

LIGTHS_MAP = {'1' : initLightMap(2, [0, 1, 0]),
             '2' : initLightMap(5, [1, 1, 0]),
             '3' : initLightMap(8, [1, 1, 1]),
             '4' : initLightMap(11, [0, 1, 1]),
             '5' : initLightMap(14, [0.5, 1.1, 0.5]) ,
             '6' : initLightMap(14, [0.5, 1, 0.5]) ,
             '7' : initLightMap(14, [1, 1, 0.75]) ,
             '8' : initLightMap(14, [0.75, 1, 1]) ,
             '9' : initLightMap(14, [1, 1, 0.75]) 
             }