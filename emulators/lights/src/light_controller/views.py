
from flask import render_template
from config import LIGTHS_MAP
from json import dumps

def room(name):
    return render_template("room.html", session_name=name, lights=LIGTHS_MAP)


def index():
    return render_template("index.html")