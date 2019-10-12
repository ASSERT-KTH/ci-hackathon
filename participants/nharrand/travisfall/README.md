## Travisfall

**Travisfall** is an ~~ugly and buggy~~ minimalistic and unpredictable 2D multiplayer platformer survival arena game.
 It use CI events as falling platforms that player need to climb in order to survive.

### Controls

 * **Ctrl:** main weapon
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
docker run travisfall -p 80:80 -p8060:8060
```