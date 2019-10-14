notaAtual = 0;
visualIndex = -1;
notas = [];
octaves = ["-1", "-1", "0", "1", "2", "3", "4", "5", "6", "7", "8"];
chords = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const BAD_NOTE = 45;
const URL_TO_ORGAN = "http://localhost:3000";

const noteNumberToChord = noteNumber => {
  chordPosition = noteNumber % 12;
  return chords[chordPosition];
};

const noteToOcate = noteNumber => {
  notePosition = Math.floor(noteNumber / 12);
  return octaves[notePosition];
};

const playNote = noteNumber => {
  noteToPlay = noteNumberToChord(noteNumber) + noteToOcate(noteNumber);
  fetch(`${URL_TO_ORGAN}/notes/${noteToPlay}/1`, { mode: "no-cors" });
};

function tock(success) {
  var delay = 0; // play one note every quarter second
  var velocity = 127; // how hard the note hits

  // noteOn
  // console.log('noteOn', notas[notaAtual])
  note = notas[notaAtual].noteNumber;
  velocity = notas[notaAtual].velocity;
  //

  if (success) {
    // play the note

    playNote(note);

    // MIDI.setVolume(0, 127);
    // MIDI.noteOn(0, note, velocity, delay);

    // delay = notas[notaAtual].deltaTime;

    // MIDI.noteOff(0, note, delay);

    notaAtual++;
    if (notaAtual >= notas.length) {
      gameOver();
    }
  } else {
    playNote(BAD_NOTE);
    // MIDI.setVolume(0, 250);
    // MIDI.noteOn(0, 30, velocity, delay);

    // delay = notas[notaAtual].deltaTime;

    // MIDI.noteOff(0, note, delay);

    notaAtual++;
    if (notaAtual >= notas.length) {
      gameOver();
    }
  }
}
function getVisualNote() {
  visualIndex++;
  return notas[visualIndex].noteNumber;
}

function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function playSong(index) {
  var song = songs[index];
  var file = dataURLtoFile(song.base64, "song" + index + ".midi");

  var reader = new FileReader();
  reader.onload = function(e) {
    midiFile = MidiFile(e.target.result);
    console.log("midiFile", midiFile);

    pegaNotas(song);
  };
  reader.readAsBinaryString(file);
}

function pegaNotas(song) {
  var faixa = song.track;
  // console.log('pegaNotas', midiFile.tracks[faixa].length)
  const firstTrack = midiFile.tracks[0];
  for (i = 0; i < midiFile.tracks[faixa].length; i++) {
    nota = midiFile.tracks[faixa][i];
    // console.log('nota', nota)
    if (nota.noteNumber && nota.subtype == "noteOn") {
      notas.push(nota);
    }
  }
}

window.onload = function() {
  MIDI.loadPlugin({
    soundfontUrl: "./soundfont/",
    instrument: "acoustic_grand_piano",
    onprogress: function(state, progress) {
      console.log("onprogress", state, progress);
    },
    onsuccess: function() {
      console.log("Midi.js loaded!");
    }
  });
};
