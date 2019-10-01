# Travis to openFrameworks and Supercollider

This template uses a simple node.js program to receive the Travis build data from the websocket and send it on via OSC to two different ports on the local machine. OSC is trivial to use in SuperCollider and openFrameworks compared to websockets making it an easier alternative. This approach can be used for openFrameworks and SuperCollider together or separately. 

## Using the template

### The node.js program

This requires that node.js is installed on the machine.

1. Nacigate to the `travis-to-osc` folder.
2. First time, run <code>npm install</code> to install osc.js and all its dependencies.
3. Start the Node application by running <code>node .</code>

Edit `index.js` to change what ports it is sending OSC to. Note that if you are adding new ports, the OSC `localPort` has to be unique even if you are not listening for OSC in the node.js application.

### openFrameworks

The `travis_to_of_sc` folder contains the standard openFrameworks project structure. Place it in your openFrameworks installation at OF_ROOT/apps/myApps/. If you are using an OS other than Linux (i.e. Windows or OSX) you may have to use the openFrameworks standard project generator to update the configuration for your platform.

You need the following addons installed in the addons folder of you OF installation:
- ofxOsc (installed by default)
- ofxJSON (https://github.com/jeffcrouse/ofxJSON)

Has been tested on openFrameworks 0.10.1

Running the program is different on different platforms. On Linux, run `make && make RunRelease` in a terminal from the `travis_to_of_sc` folder.

### SuperCollider

A SuperCollider example is provided in the `sc_src` folder. Has been tested on SuperCollider 3.10.1

Open in SuperCollider and run the code between the outer parentheses.

## License

All the code is under the MIT license. Feel free to use, change and adapt in any way.