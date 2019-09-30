---
    layout: default
    link: tech
    title: Tech 
---

The hackathon will involve Travis CI data, either online through a websocket, or offline with a [dump of 35M Travis jobs](https://zenodo.org/record/2560966).

## Input stream : the Travis CI WebSocket
A websocket with Travis builds is available at ws://travis.durieux.me. More information about the streamed objects is available [here](https://github.com/KTH/ci-hackathon/blob/master/site/travis.md). This tool uses [Travis-CI npm package](https://www.npmjs.com/package/travis-ci) to gather jobs information. Job informations are gethered every 1.5 seconds and then exposed through the websocket channel in a "real-time" stream. More information about how Travis exposes information [here](https://docs.travis-ci.com/api#jobs)

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

## Tangible output technology

### Reaktorhallen unique setup

We have setup hardware bridges to exploit the unique space of reaktorhallen. Participants have the opportunity to hook on two hardware interfaces
- [Light fixtures](lights). We will setup 20 light fixtures in reaktorhallen, which can be controlled through a simple web interface. Hackathon participants can use the [ligth fixtures emulator](https://github.com/KTH/ci-hackathon/tree/master/resources/emulators/lights) to prepare their piece of CI art. The same code can be reused to control real light fixtures on the day of the hackathon. More documentation about this interface is available [here](https://github.com/KTH/ci-hackathon/tree/master/resources/emulators/lights)
- The organ. 

### Visualization

Here are popular Javascript libraries for data vizualization
- [D3.js](https://d3js.org/)
- [P5.js](https://p5js.org/)
- [Vega Lite](https://vega.github.io/vega-lite/)

For example, the [Travis CI drum machine](https://github.com/KTH/ci-hackathon/tree/master/participants/oscarlvp/drum-machine) uses the [P5.js](https://p5js.org/) library

### Sonification

Here are examples of sound synthesis libraries
- [tone.js](https://tonejs.github.io/)
- [Faust](https://faust.grame.fr/)
- [ChucK](http://chuck.stanford.edu/)

For example, the [Pulse of Travis](https://github.com/KTH/ci-hackathon/tree/master/participants/Jacarte_bbaudry/pulse_of_travis) uses [tone.js](https://tonejs.github.io/).

### Other resources

A collection of libraries, code examples and papers that can serve to build CI-art pieces.
* [Network-synchronised metronome](https://github.com/chr15m/SyncJams) a library to synchronize several device with respect to a common pulse, over wifi. Can be useful to syncrhonize the CI event and the media displays.
* [Pure Data and openGL](https://github.com/Ant1r/ofxPof). A set of Pure Data (Pd) externals written with openFrameworks API, that bring OpenGL graphics and utilities to Pd.
* [CodePen](https://codepen.io) is a social development environment for front-end designers and developers. It includes various visual effects that can be remixed for the hackathon. Here a few curated examples
* [Infinite tree of life](https://codepen.io/ge1doot/pen/vOQZGG)

