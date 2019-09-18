
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

LIGTHS_MAP = {  '1' : initLightMap(2,   [0, 0.1, 0]),
                '2' : initLightMap(5,   [0.2, 0.1, 0]),
                '3' : initLightMap(8,   [0.4, 0.1, 0]),
                '4' : initLightMap(11,  [0.6, 0.1, 0]),
                '5' : initLightMap(14,  [0.8, 0.1, 0]) ,
                '6' : initLightMap(17,  [1, 0.1, 0]) ,

                '7' : initLightMap(20,  [0, 0.3, 0]) ,
                '8' : initLightMap(23,  [0.2, 0.3, 0]) ,
                '9' : initLightMap(26,  [0.4, 0.3, 0]),
                '10' : initLightMap(29, [0.6, 0.3, 0]),
                '11' : initLightMap(32, [0.8, 0.3, 0]),
                '12' : initLightMap(35, [1, 0.3, 0]),

                '13' : initLightMap(38, [0, 0.5, 0]),
                '14' : initLightMap(41, [0.2, 0.5, 0]),
                '15' : initLightMap(44, [0.4, 0.5, 0]),
                '16' : initLightMap(47, [0.6, 0.5, 0]),
                '17' : initLightMap(50, [0.8, 0.5, 0]),
                '18' : initLightMap(53, [1, 0.5, 0]),

                '19' : initLightMap(56, [0, 0.7, 0]),
                '20' : initLightMap(59, [0.2, 0.7, 0]),
                '21' : initLightMap(62, [0.4, 0.7, 0]),
                '22' : initLightMap(65, [0.6, 0.7, 0]),
                '23' : initLightMap(68, [0.8, 0.7, 0]),
                '24' : initLightMap(72, [1, 0.7, 0]),
             }

# 192.168.0.102
