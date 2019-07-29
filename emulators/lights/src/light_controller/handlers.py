import pysimpledmx
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
    def __init__(self):
        self.dmx = pysimpledmx.DMXConnection('/dev/ttyUSB0')
        self.fixture_map = {'1' : 2,
                            '2' : 5,
                            '3' : 8,
			    "4" : 11,
			    "5" : 14 }

    def illuminate_with(self, id, color, extra):
        for chan, color in enumerate(color, start=self.fixture_map[id]):
            self.dmx.setChannel(chan, color)
        self.dmx.render()

    def illuminate_many(self, sets, extra):
        pass
