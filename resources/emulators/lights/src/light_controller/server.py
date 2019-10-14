from flask import Flask, jsonify, request,url_for
from decorators import validate_schema
from handlers import SimulatorHandler, ControllerHandler, CompundHandler
from flask_socketio import SocketIO, emit, join_room, leave_room, send, Namespace
from config import LIGTHS_MAP
from flask_basicauth import BasicAuth
from flask_cors import CORS

import os
import threading
import json

app = Flask(__name__, template_folder='templates')
app.config["SECRET_KEY"] = 'secret!'
CORS(app)

# This is not the best solution, but its ok for the r-pi deployment
app.config['BASIC_AUTH_USERNAME'] = os.environ.get("ADMIN_USER", 'admin')
app.config['BASIC_AUTH_PASSWORD'] = os.environ.get("ADMIN_PASSWORD", 'admin')


socketio = SocketIO(app, logger=True, engineio_logger=True, ping_interval=10, ping_timeout=30)

basic_auth = BasicAuth(app)

from views import room, index, h, admin
 # SETTING WEBSOCKET FOR SIMULATOR


sessions = {
    
}

# Filter who sends commands to the handler
class Filter(object):


    def __init__(self):
        self.FILTERED = []


FILTERED = Filter()

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

        if sId:
            toDelete = None
            for k, v in sessions.items():
                if sId in list(v.keys()):
                    del v[sId] 
                if len(v.keys()) == 0:
                    print("Removing room...")
                    toDelete = k

            if toDelete:
                del sessions[toDelete] 

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


blackout_schema = {
    'required': ['session'],
    'properties': {
        'session': {'type': 'string'}
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

    if HANDLER_TYPE == 'both':
        
        return CompundHandler(sessions, socketio, FILTERED)

    return SimulatorHandler(sessions, socketio)


## REST HANDLERS

@app.route('/setcolor', methods=["POST"])
@validate_schema(light_schema)
def setlight():
    data = request.get_json()

    HANDLER.illuminate_with(data["id"], data["color"], data["session"])

    return jsonify({'result': 'ok'})


@app.route('/blackout', methods=["POST"])
@validate_schema(blackout_schema)
def setBlackout():
    
    data = request.get_json()
    for l in LIGTHS_MAP.keys():
        HANDLER.illuminate_with(l, [0, 0, 0], data["session"])

    return jsonify({'result': 'ok'})


@app.route('/filter', methods=["POST"])
@basic_auth.required
def filter():
    data = json.loads(request.get_data().decode())

    FILTERED.FILTERED = data

    HANDLER.set_filter(FILTERED.FILTERED)

    return jsonify({'result': data})


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

# ADMIN CONTENT
@app.route('/admin')
@basic_auth.required
def admin_handler():
    return admin(sessions, FILTERED.FILTERED)

# STATIC CONTENT
@app.route('/')
def index_handler():
    return index()

if __name__ == '__main__':

    APP_HOST = os.environ.get("APP_HOST", '0.0.0.0')
    APP_PORT = os.environ.get("APP_PORT", 8000)
    APP_DEBUG = os.environ.get("APP_DEBUG", False)

    HANDLER = initHandler()
    socketio.run(app, debug=APP_DEBUG, host=APP_HOST , port=APP_PORT)