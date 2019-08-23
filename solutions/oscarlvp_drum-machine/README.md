# The Travis CI Drum Machine

This simmple web application generates sound from the events fired by [Travis CI](https://travis-ci.org/). The application implements a virtual [drum machine](https://en.wikipedia.org/wiki/Drum_machine) with 47 instruments (rows) and 53 slots for each instrument (columns).

When an event occurs, the repository identifier is used to compute a cell in the machine and the value of that cell is changed.

This project uses [the awesome p5js](https://p5js.org/) and [the incredible WebAudioFont](https://github.com/surikov/webaudiofont) libraries.

The drum machine code is based on [this example](https://github.com/surikov/midi-sounds-react-examples/tree/master/examples/midi-sounds-example6) from WebAudioFont.