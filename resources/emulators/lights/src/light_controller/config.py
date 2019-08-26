
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
                '6' : initLightMap(17, [0.5, 1, 0.5]) ,
                '7' : initLightMap(20, [1, 1, 0.75]) ,
                '8' : initLightMap(23, [0.75, 1, 1]) ,
                '9' : initLightMap(26, [1, 1, 0.75]),
                '10' : initLightMap(29, [1, 1, 0.75]),
                '11' : initLightMap(32, [1, 1, 0.75]),
                '12' : initLightMap(35, [1, 1, 0.75]),
                '13' : initLightMap(38, [1, 1, 0.75]),
                '14' : initLightMap(41, [1, 1, 0.75]),
                '15' : initLightMap(44, [1, 1, 0.75]),
                '16' : initLightMap(47, [1, 1, 0.75]),
                '17' : initLightMap(50, [1, 1, 0.75]),
                '18' : initLightMap(53, [1, 1, 0.75]),
                '19' : initLightMap(56, [1, 1, 0.75]),
                '20' : initLightMap(59, [1, 1, 0.75]),
                '21' : initLightMap(62, [1, 1, 0.75]),
                '22' : initLightMap(65, [1, 1, 0.75]),
                '23' : initLightMap(68, [1, 1, 0.75]),
                '24' : initLightMap(72, [1, 1, 0.75]),
                '25' : initLightMap(75, [1, 1, 0.75]),
                '26' : initLightMap(78, [1, 1, 0.75]),
             }

# 192.168.0.102