notaAtual=0;
notas = [];

function tock(success){
    var delay = 0; // play one note every quarter second
    var note = 50; // the MIDI note
    var velocity = 127; // how hard the note hits

    // noteOn
    // console.log('noteOn', notas[notaAtual])
    note = notas[notaAtual].noteNumber;
    velocity = notas[notaAtual].velocity;
    //

    if(success){
        // play the note
        MIDI.setVolume(0, 127);
        MIDI.noteOn(0, note, velocity, delay);

        delay = notas[notaAtual].deltaTime;

        MIDI.noteOff(0, note, delay);

        notaAtual++;
        if(notaAtual >= notas.length){
            gameOver();
        }
    }else{
        MIDI.setVolume(0, 200);
        rand = Math.floor(11) - 5;
        MIDI.noteOn(0, note + rand, velocity, delay);

        delay = notas[notaAtual].deltaTime;

        MIDI.noteOff(0, note, delay);

        notaAtual++;
        if(notaAtual >= notas.length){
            gameOver();
        }
    }
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

function playSong(index){

    var song = songs[index];
    var file = dataURLtoFile(song.base64, 'song'+index + '.midi');

    var reader = new FileReader();
    reader.onload = function(e){
        midiFile = MidiFile(e.target.result);
        console.log('midiFile', midiFile);

        pegaNotas(song);

    }
    reader.readAsBinaryString(file);

}

function pegaNotas(song){
    var faixa = song.track;
    // console.log('pegaNotas', midiFile.tracks[faixa].length)
    for(i=0; i < midiFile.tracks[faixa].length; i++){
        nota = midiFile.tracks[faixa][i];
        // console.log('nota', nota)
        if(nota.noteNumber && nota.subtype == 'noteOn'){
            notas.push(nota);
        }
    }
}

window.onload = function () {
    MIDI.loadPlugin({
        soundfontUrl: "./soundfont/",
        instrument: "acoustic_grand_piano",
        onprogress: function(state, progress) {
            console.log('onprogress', state, progress);
        },
        onsuccess: function() {
            console.log('Midi.js loaded!')
        }
    });
}
