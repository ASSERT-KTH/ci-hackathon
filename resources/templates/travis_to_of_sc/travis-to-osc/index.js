var osc = require("osc"), WebSocket = require("ws");;

var scPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57122,

    // This is where sclang is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 57120,
    metadata: true
});

var ofPort = new osc.UDPPort({
    // This is the port we're listening on.
    localAddress: "127.0.0.1",
    localPort: 57123,

    // This is where openFrameworks is listening for OSC messages.
    remoteAddress: "127.0.0.1",
    remotePort: 9771,
    metadata: true
});

// Open the socket.
scPort.open();
ofPort.open();

scPort.on("ready", portIsReady);
ofPort.on("ready", portIsReady);

var portsReady = 0; // count the number of ports that are ready
function portIsReady() {
  portsReady += 1;
  // start websocket listening when both osc ports are ready
  if(portsReady >=  2) {
    ws = new WebSocket('wss://travis.durieux.me');
    ws.onmessage = sendViaOsc;
  }
}

// Interesting fields in the travis data:
// data.state
// event
// data.repository_id
// data.repository_slug
// data.config.language
// data.commit.committer_name
// data.commit.author_name
// data.commit.message

function sendViaOsc(travis) {
  console.log(travis["data"]);
  var msg = {
      address: "/travis-via-osc",
      args: [
          {
              type: "s",
              value: travis["data"]
          },
      ]
  };
  console.log("Sending message", msg.address, msg.args);
  scPort.send(msg);
  ofPort.send(msg);
}