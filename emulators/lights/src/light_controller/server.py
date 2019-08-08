from flask import Flask, jsonify, request,url_for
from decorators import validate_schema
from handlers import SimulatorHandler, ControllerHandler
from flask_socketio import SocketIO, emit, join_room, leave_room, send, Namespace

import os
app = Flask(__name__, template_folder='templates')

from views import room, index, h
 # SETTING WEBSOCKET FOR SIMULATOR

socketio = SocketIO(app, ping_interval=2, ping_timeout=10 )#, logger=True, engineio_logger=True)

sessions = {
    
}

class SimulatorNamespace(Namespace):


    #@socketio.on('connect', namespace='/simulator')
    def on_connect(self):
        session = request.args.get("session", None)

        sId = request.sid

        if session:
            print("Registering", session, sId)

            if session in sessions:
                if sId not in sessions[session]:
                    sessions[session][sId] = True
            else:
                sessions[session] = {sId: True}
        
        socketio.emit("sessions", sessions , json=True,namespace='/simulator')

    #@socketio.on('disconnect', namespace='/simulator')
    def on_disconnect(self):

        print("Disconnecting", request.sid)
        sId = request.sid

        print(sId)
        if sId:
            for k, v in sessions.items():
                if sId in v.keys():
                    del v[sId] 

        socketio.emit("sessions", sessions , json=True,namespace='/simulator')
socketio.on_namespace(SimulatorNamespace("/simulator"))
# JSON SCHEMA VALIDATOR

light_schema = {
    'required': ['id', 'color', 'session'],
    'properties': {
        'id': { 'type': 'string' },
        'session': {'type': 'string'},
        'color': { 'type': 'array', "items": { "type": 'number', "minimum": 0,
  "maximum": 255} },
    }
}


bulk_schema = {
    'required': ['set', 'session'],
    'properties': {
        'session': {
            'type': 'string'
        },
        'set': {
            'type': 'array',
            'items': {
                "type": 'object',
                'properties': {
                    'id': {
                        'type': 'string'
                    },
                    'color': {
                        'type': 'array',
                        "items": {
                            'type': "number",
                            "minimum": 0,
                            "maximum": 255
                        }
                    }
                }
            }
        }
    }
}

## Setting up controller using environment variable

HANDLER = None

def initHandler():
    HANDLER_TYPE = os.environ.get("LIGHT_CONTROLLER", 'simulator')

    print("Handler type", HANDLER_TYPE)

    if HANDLER_TYPE == 'controller':
        
        return ControllerHandler()

    return SimulatorHandler(sessions, socketio)


## REST HANDLERS

@app.route('/setcolor', methods=["POST"])
@validate_schema(light_schema)
def setlight():
    data = request.get_json()

    HANDLER.illuminate_with(data["id"], data["color"], data["session"])

    return jsonify({'result': 'ok'})



@app.route('/setbulk', methods=["POST"])
@validate_schema(bulk_schema)
def setBulkLight():
    data = request.get_json()

    for s in data["set"]:
        HANDLER.illuminate_with(s["id"], s["color"], data["session"])

    return jsonify({'result': 'ok'})

# STATIC CONTENT
@app.route('/dashboard/<session_name>')
def room_handler(session_name):
    return room(session_name)


# STATIC CONTENT
@app.route('/help')
def help_handler():
    return h(light_schema, bulk_schema)

# STATIC CONTENT
@app.route('/')
def index_handler():
    return index()

if __name__ == '__main__':

    APP_HOST = os.environ.get("APP_HOST", '0.0.0.0')
    APP_PORT = os.environ.get("APP_PORT", 8000)
    APP_DEBUG = os.environ.get("APP_DEBUG", False)

    HANDLER = initHandler()

    app.run(APP_HOST, APP_PORT, APP_DEBUG)

    socketio.run(app)