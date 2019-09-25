const path = require("path");
const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// Start server
server.listen(80, () => console.log("Listening on port 80!"));

// Serve web view on localhost root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Play note or chords of given length
app.get("/notes/:note/:length", (req, res) => {
  io.emit("note", { note: req.params.note, length: req.params.length });
  res.sendStatus(200, { note: req.params.note, length: req.params.length });
});
