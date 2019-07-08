# The KTH Continuous Integration Hackathon

> We build beautiful visualizations or sonifications of continuous integration (of compilation, test, analysis, packaging, deployment, etc).

## The Concept

For months, we prepare our prototypes about CI data and activity. On October 14 2019, we meet in the nuclear reactor R1 at KTH for a unique moment of art and software technology.

## Participants

To participate to the hackathon, simply make a pull-request on this repo.

Participants:
s
- Thomas Durieux: 
    * [Continuous Integration Rain](https://travis.durieux.me/rain.html) [repo](https://travis-ci.com/tdurieux/travis-listener/)
    * [Travis Drum](https://kth.github.io/ci-hackathon/drum_tdurieux) (details in folder [drum_tdurieux](drum_tdurieux)) based on https://codepen.io/teropa/pen/PKoYXM
    * [Travis Canvas](https://travis.durieux.me/canvas.html) 
    * [Travis Tree](https://travis.durieux.me/tree/) based on https://github.com/guo2/tree_js
- Long Zhang: [The King of CI Fighters](https://youtu.be/94_OSJQFY9Q) (details in folder [king_of_ci_fighters](king_of_ci_fighters))
- Simone Stefani: sonification with chords (details in folder [stefani](stefani))
- Javier Cabrera and Benoit Baudry: [the pulse of Travis](https://kth.github.io/ci-hackathon/cabrera_baudry/index.html) (details in folder [cabrera_baudry](cabrera_baudry)
- Oscar Luis Vera Pérez: [The Travis CI Drum Machine](https://kth.github.io/ci-hackathon/drum-machine) (details in folder [drum-machine](drum-machine))
- Add your name / your team with a pull request :-)

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

## Frequently Asked Questions

- **I'm looking for partners, I'd like to create or join a team?**

  Simply create an issue on this repository and tell what you are looking for.
