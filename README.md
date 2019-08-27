# The KTH Continuous Integration Hackathon

> We build beautiful visualizations or sonifications of continuous integration (of compilation, test, analysis, packaging, deployment, etc).

## The Concept

For months, we prepare our prototypes about CI data and activity. On October 14 2019, we meet in the nuclear reactor R1 at KTH for a unique moment of art and software technology.

[Learn more about continuous integration and the hackathon data](https://github.com/KTH/ci-hackathon/blob/master/site/travis.md).

## Participants

To participate to the hackathon, clone the repo, add a subfolder in the 'participants' folder, named with your github identifier(s) and simply make a pull-request on this repo. You will find more details about this in the [FAQ](https://github.com/KTH/ci-hackathon/blob/master/site/faq.md).

The list of current participating teams and their ongoing CI art projects is available [here](https://kth.github.io/ci-hackathon/#participants).


## Program of October 14 2019

- 18:00 Welcome talk by hackathon curator Benoit Baudry
- 18:20 Reading of Code (performer TBA)
- 18:30 Demo and explanation of the Travis API / Websocket (Thomas Durieux)
- 18:40 Demo and Explanation of the organ interface (Simone Stefani)
- 18:50 Demo and Explanation of the light interface (TBA)
- 19h00 - 22:00: Pizza, beer and coding
- 22h00 CI Rain: Thomas Durieux
- 22h15 TBA
- 22h30 TBA
- 22h45 TBA

## Technology

### Travis API

We use Travis CI as main source of data. Travis CI provides different API end-points to listen to their builds. Reference documentation: <https://docs.travis-ci.com/user/developer/>

### WebSocket

A websocket with Travis builds is available at <ws://travis.durieux.me>.

PYTHON: `pip3 install websocket_client`

```python
import websocket
def on_message(ws, message):
    print(message)

websocket.enableTrace(True)
ws = websocket.WebSocketApp("wss://travis.durieux.me/",on_message = on_message)
ws.run_forever()
```

JAVASCRIPT

```js
ws = new WebSocket('wss://travis.durieux.me’);
ws.onmessage = console.log
```

More information is available [here](https://github.com/KTH/ci-hackathon/blob/master/ci-ws-documentation.md).

### Travis Listener (NodeJS)

[Travis Listener](https://github.com/tdurieux/travis-listener) provides a websocket server for easier use ([documentation](https://durieux.me/projects/travis_listener.html))

### Visualization

- [D3.js](https://d3js.org/)
- [P5.js](https://p5js.org/)
- [Vega Lite](https://vega.github.io/vega-lite/)

### Sonification

For sonification, one can use the library [tone.js](https://tonejs.github.io/)



