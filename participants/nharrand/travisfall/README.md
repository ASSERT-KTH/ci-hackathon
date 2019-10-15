## Travisfall

Try it at http://130.237.67.252:8060/

**Travisfall** is an ~~ugly and buggy~~ minimalistic and unpredictable 2D multiplayer platformer survival arena game.
 It use CI events as falling platforms that player need to climb in order to survive.

### Controls

 * **Ctrl:** main weapon
 * **Shift:** dash
 * **Right and left arrows:** direction
 * **Up arrow and space**: jump

![Screenshot](/participants/nharrand/travisfall/img/screenshot.png)

### Build

```sh
mvn install
docker build -t travisfall .
```

### Run

```sh
docker run travisfall -p 8060:8060
```

### Play

Open http://localhost:8060

