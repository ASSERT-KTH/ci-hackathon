from flask import Flask, jsonify, request,url_for
from decorators import validate_schema
from handlers import SimulatorHandler, ControllerHandler
from flask_socketio import SocketIO, emit, join_room, leave_room, send

import os
app = Flask(__name__, template_folder='templates')

from views import index
 # SETTING WEBSOCKET FOR SIMULATOR

socketio = SocketIO(app)

sessions = {
    
}

@socketio.on('connect', namespace='/simulator')
def on_connect():
    session = request.args["session"]

    sId = request.sid

    print("Registering", session, sId)

    if session in sessions:
        if sId not in sessions[session]:
            sessions[session][sId] = True
    else:
        sessions[session] = {sId: True}

@socketio.on('disconnect', namespace='/simulator')
def on_disconnect():

    sId = request.namespace.socket.sessid

    for k, v in sessions:
        if sId in v:
            del v[sId] 

# STATIC CONTENT
@app.route('/dashboard/<session_name>')
def index_handler(session_name):
    return index(session_name)


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

HANDLER = SimulatorHandler(sessions, socketio)

def getHandler():
    HANDLER_TYPE = os.environ.get("LIGHT_CONTROLLER", default='simulator')

    if HANDLER_TYPE == 'controller':
        handler = ControllerHandler() # Initialize controller handler
    
        HANDLER = handler

getHandler()

## REST HANDLERS

@app.route('/setcolor', methods=["POST"])
@validate_schema(light_schema)
def setlight():
    data = request.get_json()


    handler = HANDLER
    handler.illuminate_with(data["id"], data["color"], data["session"])

    return jsonify({'result': 'ok'})



@app.route('/setbulk', methods=["POST"])
@validate_schema(bulk_schema)
def setBulkLight():
    data = request.get_json()


    handler = HANDLER
    handler.illuminate_many(data["set"], data["session"])

    return jsonify({'result': 'ok'})


if __name__ == '__main__':

    APP_HOST = os.environ.get("APP_HOST", default='0.0.0.0')
    APP_PORT = os.environ.get("APP_PORT", default=8000)
    APP_DEBUG = os.environ.get("APP_DEBUG", default=False)

    app.run(APP_HOST, APP_PORT, APP_DEBUG)

    socketio.run(app)