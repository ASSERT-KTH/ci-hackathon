  initAudio() {
    console.log('initAudio M♩D♩Sounds');
    if (this.player) {
      if (this.audioContext) {
        this.player.cancelQueue(this.audioContext);
      }
    }
    var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextFunc();
    this.destination = this.audioContext.destination;
    this.player = new WebAudioFontPlayer();
    this.equalizer = this.player.createChannel(this.audioContext);
    this.output = this.audioContext.createGain();
    this.echo = this.player.createReverberator(this.audioContext);
    this.echo.wet.gain.setTargetAtTime(this.state.echo, 0, 0.0001);
    this.echo.output.connect(this.output);
    this.equalizer.output.connect(this.echo.input);
    this.output.connect(this.destination);
    this.volumesInstrument = [];
    this.volumesDrum = [];
    this.midiNotes = [];
  }
  
  cacheDrum(n) {
    var info = this.player.loader.drumInfo(n);
    if (window[info.variable]) {
      return;
    }
    this.player.loader.startLoad(this.audioContext, info.url, info.variable);
    this.player.loader.waitLoad(function () {
      console.log('cached', n, info.title);
    });
  }
  playDrum(when, drum) {
    var info = this.player.loader.drumInfo(drum);
    if (window[info.variable]) {
      var pitch = window[info.variable].zones[0].keyRangeLow;
      var volume = this.volumeDrumAdjust(drum);
      this.player.queueWaveTable(this.audioContext, this.equalizer.input, window[info.variable], when, pitch, 3, volume);
    } else {
      this.cacheDrum(drum);
    }
  }
  playDrumsAt(when, drums) {
    for (var i = 0; i < drums.length; i++) {
      this.playDrum(when, drums[i]);
    }
  }
  volumeInstrumentAdjust(instrument) {
    if (!(this.volumesInstrument[instrument] === undefined)) {
      return this.volumesInstrument[instrument];
    }
    return 1;
  }
  volumeDrumAdjust(drum) {
    if (!(this.volumesDrum[drum] === undefined)) {
      return this.volumesDrum[drum];
    }
    return 1;
  }
  startPlayLoop(beats, bpm, density, fromBeat) {
    this.stopPlayLoop();
    this.loopStarted = true;
    var wholeNoteDuration = 4 * 60 / bpm;
	if(fromBeat<beats.length){
		this.beatIndex = fromBeat;
	}else{
		this.beatIndex = 0;
	} 
    this.playBeatAt(this.contextTime(), beats[this.beatIndex], bpm);
    var nextLoopTime = this.contextTime() + density * wholeNoteDuration;
    var me = this;
    this.loopIntervalID = setInterval(function () {
      if (me.contextTime() > nextLoopTime - density * wholeNoteDuration ) {
        me.beatIndex++;
        if (me.beatIndex >= beats.length) {
          me.beatIndex = 0;
        }
        me.playBeatAt(nextLoopTime, beats[me.beatIndex], bpm);
        nextLoopTime = nextLoopTime + density * wholeNoteDuration;
      }
    }, 22);
  }
  stopPlayLoop() {
    this.loopStarted = false;
    clearInterval(this.loopIntervalID);
    this.cancelQueue();
  }
  cancelQueue() {
    this.player.cancelQueue(this.audioContext);
  }
  playBeatAt(when, beat, bpm) {
    this.playDrumsAt(when, beat[0]);
    var chords = beat[1];
    var N = 4 * 60 / bpm;
    for (var i = 0; i < chords.length; i++) {
      var chord = chords[i];
      var instrument = chord[0];
      var pitches = chord[1];
      var duration = chord[2];
      var kind = 0;
      if (chord.length > 3) {
        kind = chord[3];
      }
      if (kind === 1) {
        this.playStrumDownAt(when, instrument, pitches, duration * N);
      } else {
        if (kind === 2) {
          this.playStrumUpAt(when, instrument, pitches, duration * N);
        } else {
          if (kind === 3) {
            this.playSnapAt(when, instrument, pitches, duration * N);
          } else {
            this.playChordAt(when, instrument, pitches, duration * N);
          }
        }
      }
    }
  }
  playChordAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueChord(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  playStrumUpAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueStrumUp(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  playStrumDownAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueStrumDown(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  playSnapAt(when, instrument, pitches, duration) {
    var info = this.player.loader.instrumentInfo(instrument);
    if (window[info.variable]) {
      this.player.queueSnap(this.audioContext, this.equalizer.input, window[info.variable], when, pitches, duration, this.volumeInstrumentAdjust(instrument));
    } else {
      this.cacheInstrument(instrument);
    }
  }
  midNoteOn(pitch, velocity) {
    this.midiNoteOff(pitch);
    if (this.miditone) {
      var envelope = this.player.queueWaveTable(this.audioContext, this.audioContext.destination, this.tone, 0, pitch, 123456789, velocity / 100);
      var note = {
        pitch: pitch,
        envelope: envelope
      };
      this.midiNotes.push(note);
    }
  }
  midiNoteOff(pitch) {
    for (var i = 0; i < this.midiNotes.length; i++) {
      if (this.midiNotes[i].pitch === pitch) {
        if (this.midiNotes[i].envelope) {
          this.midiNotes[i].envelope.cancel();
        }
        this.midiNotes.splice(i, 1);
        return;
      }
    }
  }
  midiOnMIDImessage(event) {
    var data = event.data;
    //var cmd = data[0] >> 4;
    //var channel = data[0] & 0xf;
    var type = data[0] & 0xf0;
    var pitch = data[1];
    var velocity = data[2];
    switch (type) {
      case 144:
        this.midNoteOn(pitch, velocity);
        //logKeys();
        break;
      case 128:
        this.midiNoteOff(pitch);
        //logKeys();
        break;
      default:
        break;
    }
  }
  midiOnStateChange(event) {
    console.log('midiOnStateChange', event);
    //msg.innerHTML = event.port.manufacturer + ' ' + event.port.name + ' ' + event.port.state;
  }
  requestMIDIAccessSuccess(midi) {
    var inputs = midi.inputs.values();
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
      console.log('midi input', input);
      input.value.onmidimessage = this.midiOnMIDImessage;
    }
    midi.onstatechange = this.midiOnStateChange;
  }
  requestMIDIAccessFailure(e) {
    console.log('requestMIDIAccessFailure', e);
  }
  startMIDIInput() {
    if (navigator.requestMIDIAccess) {
      console.log('navigator.requestMIDIAccess ok');
      navigator.requestMIDIAccess().then(this.requestMIDIAccessSuccess, this.requestMIDIAccessFailure);
    } else {
      console.log('navigator.requestMIDIAccess undefined');
      //msg.innerHTML = 'navigator.requestMIDIAccess undefined';
    }
  }
  playDrumsNow(drums) {
    this.playDrumsAt(0, drums);
  }
  playChordNow(instrument, pitches, duration) {
    this.playChordAt(0, instrument, pitches, duration);
  }
  playStrumUpNow(instrument, pitches, duration) {
    this.playStrumUpAt(0, instrument, pitches, duration);
  }
  playStrumDownNow(instrument, pitches, duration) {
    this.playStrumDownAt(0, instrument, pitches, duration);
  }
  playSnapNow(instrument, pitches, duration) {
    this.playSnapAt(0, instrument, pitches, duration);
  }
  setMasterVolume(volume) {
    this.output.gain.setTargetAtTime(volume, 0, 0.0001);
    this.setState({
      master: volume
    });
  }
  setInstrumentVolume(instrument, volume) {
    this.volumesInstrument[instrument] = volume;
  }
  setDrumVolume(drum, volume) {
    this.volumesDrum[drum] = volume;
  }
  setEchoLevel(value) {
    this.echo.wet.gain.setTargetAtTime(value, 0, 0.0001);
    this.setState({
      echo: value
    });
  }
  setBand32(level) {
    this.equalizer.band32.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q32: level
    });
  }
  setBand64(level) {
    this.equalizer.band64.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q64: level
    });
  }
  setBand128(level) {
    this.equalizer.band128.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q128: level
    });
  }
  setBand256(level) {
    this.equalizer.band256.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q256: level
    });
  }
  setBand512(level) {
    this.equalizer.band512.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q512: level
    });
  }
  setBand1k(level) {
    this.equalizer.band1k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q1k: level
    });
  }
  setBand2k(level) {
    this.equalizer.band2k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q2k: level
    });
  }
  setBand4k(level) {
    this.equalizer.band4k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q4k: level
    });
  }
  setBand8k(level) {
    this.equalizer.band8k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q8k: level
    });
  }
  setBand16k(level) {
    this.equalizer.band16k.gain.setTargetAtTime(level, 0, 0.0001);
    this.setState({
      q16k: level
    });
  }
  setKeyboardInstrument(n) {
    var info = this.player.loader.instrumentInfo(n);
    if (window[info.variable]) {
      this.miditone = window[info.variable];
      return;
    }
    this.player.loader.startLoad(this.audioContext, info.url, info.variable);
    this.player.loader.waitLoad(function () {
      console.log('cached', n, info.title);
      this.miditone = window[info.variable];
    });
  }
}