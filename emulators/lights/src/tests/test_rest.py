
from common import *
import json

def test_home(client):
    """Access index html page"""
    rv = client.get('/')


def test_light_rest_call(client):
    """Put light"""

    rv = client.post('/setcolor', data=json.dumps(dict(
        id='1',
        session='xavi',
        color=[100, 200, 100] # rgb
    )),  content_type='application/json')

    print(rv.data)
    assert rv.status_code == 200

def test_light_invalid_method(client):
    """Put invalid method"""

    rv = client.get('/setcolor', data=json.dumps(dict(
        color=[100, 200, 400] # rgb
    )),  content_type='application/json')

    assert rv.status_code == 405

def test_light_invalid_json(client):
    """Put invalid json light"""

    rv = client.post('/setcolor', data=json.dumps(dict(
        color=[100, 200, 400] # rgb
    )),  content_type='application/json')

    print(rv.data)
    assert rv.status_code == 406


def test_bulk_light_rest_call(client):
    """Put light"""

    rv = client.post('/setbulk', data=json.dumps(dict(
        set=[
            dict(id='1', color=[100, 200, 200]),
            dict(id='2', color=[100, 200, 200]),
            dict(id='3', color=[100, 200, 200])
        ],
        session='xavi'
    )),  content_type='application/json')

    print(rv.data)
    assert rv.status_code == 200

def test_bulk_light_invalid_method(client):
    """Put invalid method"""

    rv = client.get('/setbulk', data=json.dumps(dict(
        color=[100, 200, 400] # rgb
    )),  content_type='application/json')

    assert rv.status_code == 405

def test_bulk_light_invalid_json(client):
    """Put invalid json light"""

    rv = client.post('/setbulk', data=json.dumps(dict(
       set=[
            dict(id='1', color=[100, 200, 400]),
            dict(id='2', color=[100, 200, 200]),
            dict(id='3', color=[100, 200, 200])
        ]
    )),  content_type='application/json')

    print(rv.data)
    assert rv.status_code == 406