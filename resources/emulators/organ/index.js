const path = require("path");
const bodyParser = require("body-parser");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// Start server
server.listen(3000, () => console.log("Listening on port 3000!"));

// Parser for JSON request body
app.use(bodyParser.json());

// Serve web view on localhost root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Play note of given length
app.get("/notes/:note/:length", (req, res) => {
  io.emit("note", { note: [req.params.note], length: req.params.length });
  res.sendStatus(200, { note: req.params.note, length: req.params.length });
});

// Play a chord up to 3 notes
app.post("/notes", (req, res) => {
  io.emit("note", { note: req.body.notes, length: req.body.duration });
  res.sendStatus(200, { note: req.body.notes, length: req.body.duration });
});

// Set sound of the synth
app.put("/sound", (req, res) => {
  const config = getConfigFromInstrument(req.body.instrument);
  io.emit("sound", { config });
  res.sendStatus(200, { config });
});

const getConfigFromInstrument = instrument => {
  switch (instrument) {
    case "piano":
      return {
        volume: -8,
        oscillator: { partials: [1, 2, 5] },
        portamento: 0.005
      };
    case "organ":
      return {
        oscillator: {
          type: "amsine",
          modulationType: "square",
          harmonicity: 1.0
        },
        portamento: 0,
        envelope: {
          attack: 0.29,
          attackCurve: "sine",
          decay: 0.42,
          decayCurve: "linear",
          sustain: 0.04,
          release: 0.6,
          releaseCurve: "linear"
        }
      };
    default:
      return {};
  }
};
