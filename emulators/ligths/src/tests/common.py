import os
import sys, inspect
import tempfile

import pytest

myPath = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, myPath + '/../')
sys.path.insert(0, myPath + '/../light_controller')

from light_controller.server import app


@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    yield client
