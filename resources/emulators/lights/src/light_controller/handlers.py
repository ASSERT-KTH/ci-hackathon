import pysimpledmx
import json
from config import LIGTHS_MAP

class BaseHandler(object):

    def illuminate_with(self, id, color, extra):
        raise "Not implemented"

    def set_filter(self, sessions):
        self.filtered_sessions = sessions

class SimulatorHandler(BaseHandler):

    # Handle light commands sending them to websocket clients

    def __init__(self, sessions, socketio):
        self.sessions = sessions
        self.socketio = socketio

    def getSiD(self, session_name):

        session_copy = dict(self.sessions)

        if session_name in session_copy:
            return dict(session_copy[session_name])
        return {}

    def illuminate_with(self, id, color, extra):
        

        for k, v in self.getSiD(extra).items():
            self.socketio.emit("single", dict(id=id, color=color) , json=True, room=k, namespace='/simulator')


class ControllerHandler(BaseHandler):
    def __init__(self):
        self.dmx = pysimpledmx.DMXConnection('/dev/ttyUSB0')
        self.fixture_map = LIGTHS_MAP

    def illuminate_with(self, id, color, extra):
        if extra in self.filtered_sessions:
            for chan, color in enumerate(color, start=self.fixture_map[id]["dmxId"]):
                self.dmx.setChannel(chan, color)
            self.dmx.render()

class CompundHandler(BaseHandler):

    def __init__(self, sessions, socketio, FILTERED):
        self.simulator = SimulatorHandler(sessions, socketio)
        self.controller = ControllerHandler()

        self.set_filter(FILTERED)
        

    def illuminate_with(self, id, color, extra):
        self.simulator.illuminate_with(id, color, extra)
        self.controller.illuminate_with(id, color, extra)

    def set_filter(self, sessions):
        self.simulator.set_filter(sessions)
        self.controller.set_filter(sessions)
        
