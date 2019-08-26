---
    layout: default
    link: technology
    title: Technology 
---

Here is a list of all the technologies involved in the hackathon and those we think may be useful.

## Travis API
We use Travis CI as main source of data. Travis CI provides different API end-points to listen to their builds. Reference documentation: https://docs.travis-ci.com/user/developer/

## WebSocket
A websocket with Travis builds is available at ws://travis.durieux.me.

### PYTHON

Install the websocket client package

`pip3 install websocket_client`

Run the following code:

```Python
import websocket
def on_message(ws, message):
    print(message)

websocket.enableTrace(True)
ws = websocket.WebSocketApp("wss://travis.durieux.me/",on_message = on_message)
ws.run_forever()
```

### JavaScript

```Python
ws = new WebSocket('wss://travis.durieux.me’);
ws.onmessage = console.log
```
More information is available [here](/travis.html).

## Travis Listener (NodeJS)

[Travis Listener](https://github.com/tdurieux/travis-listener) provides a websocket server for easier use ([documentation](https://durieux.me/projects/travis_listener.html))

## Visualization

- [D3.js](https://d3js.org/)
- [P5.js](https://p5js.org/)
- [Vega Lite](https://vega.github.io/vega-lite/)

## Sonification

For sonification, one can use the library [tone.js](https://tonejs.github.io/)

## Other resources

A collection of libraries, code examples and papers that can serve to build CI-art pieces.

### Libraries

* [Network-synchronised metronome](https://github.com/chr15m/SyncJams) a library to synchronize several device with respect to a common pulse, over wifi. Can be useful to syncrhonize the CI event and the media displays.
* [Pure Data and openGL](https://github.com/Ant1r/ofxPof). A set of Pure Data (Pd) externals written with openFrameworks API, that bring OpenGL graphics and utilities to Pd.

### CodePen

[CodePen](https://codepen.io) is a social development environment for front-end designers and developers. It includes various visual effects that can be remixed for the hackathon. Here a few curated examples

* [Rain](https://codepen.io/MillerTime/pen/oXmgJe). This pen served as a starting point for the [CI rain](https://travis.durieux.me/rain.html).
* [Infinite tree of life](https://codepen.io/ge1doot/pen/vOQZGG)

## Hardware bridges

Here we will post code to control actual hardware fixtures:
- [Lights](lights)
- The organ.
