
import json

class BaseHandler(object):

    def illuminate_with(self, id, color, extra):
        raise "Not implemented"
    def illuminate_many(self, sets, extra):
        raise "Not implemented"

class SimulatorHandler(BaseHandler):

    # Handle light commands sending them to websocket clients

    def __init__(self, sessions, socketio):
        self.sessions = sessions
        self.socketio = socketio

    def getSiD(self, session_name):
        if session_name in self.sessions:
            return self.sessions[session_name]
        return {}

    def illuminate_with(self, id, color, extra):
        for k, v in self.getSiD(extra).items():
            self.socketio.emit("single", dict(id=id, color=color) , json=True, room=k, namespace='/simulator')

    def illuminate_many(self, sets, extra):
        for k, v in self.getSiD(extra).items():
            self.socketio.emit("bulk", dict(sets=sets) , json=True, room=k, namespace='/simulator')

class ControllerHandler(BaseHandler):
    pass

    # TODO