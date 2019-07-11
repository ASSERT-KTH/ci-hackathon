
from flask import render_template

def index(name):
    return render_template("index.html", session_name=name)