
from flask import render_template
from config import LIGTHS_MAP
from json import dumps

def room(name):
    return render_template("room.html", session_name=name, lights=LIGTHS_MAP)


def index():
    return render_template("index.html")


def h(schema1, schema2):
    return render_template("help.html", schema1=dumps(schema1, indent=4, sort_keys=True), 
schema2=dumps(schema2, indent=4, sort_keys=True))