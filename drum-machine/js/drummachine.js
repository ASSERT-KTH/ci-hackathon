
const DRUM_COUNT = 47;
const KEY_COUNT = 5;
const WebAudioContext = window.AudioContext || window.webkitAudioContext;

class DrumMachine {

    constructor(slots, key=2) {
        this.slotCount = slots;
        this.selectedKey = key;

        this.initializeBeats();
    }

    initialize() {
        this.initializePlayer();
        this.initializeInstruments();
        this.initializeLoop();
    }

    initializePlayer() {
        if(this.player && this.audioContext) {
            this.player.cancelQueue(this.audioContext);
        }
        this.audioContext = new WebAudioContext();
        this.destination = this.audioContext.destination;
        this.player = new WebAudioFontPlayer();
        this.equalizer = this.player.createChannel(this.audioContext);
        this.output = this.audioContext.createGain();
        this.echo = this.player.createReverberator(this.audioContext);
        this.echo.output.connect(this.output);
        this.equalizer.output.connect(this.echo.input);
        this.output.connect(this.destination);
    }

    initializeInstruments() {

        let loader = this.player.loader;
        this.instruments = [...Array(DRUM_COUNT).keys()].map(
            index => 
                loader.drumInfo(KEY_COUNT * index + this.selectedKey)
        );
        
        for(let instrument of this.instruments) {
            if(window[instrument.variable]) {
                continue;
            }
            loader.startLoad(this.audioContext, instrument.url, instrument.variable);
            loader.waitLoad(() => console.log('Intrument loaded ' + instrument.title));
        }
    }

    initializeBeats() {
        let emptyBeats = Array(DRUM_COUNT).fill([]);
        this.beats = emptyBeats.map(() => Array(this.slotCount).fill(false));
    }

    initializeLoop() {
        this.playing = false;
        this.currentBeatIndex = -1;
        this.volume = 10;
    }

    startLoop(bpm, density, fromBeat=0) {
        this.stopLoop();

        this.playing = true;
        let noteDuration = 1000;//240 / bpm;
        this.currentBeatIndex = fromBeat % this.slotCount;

        this.loopInterval = setInterval(() => {
            this.currentBeatIndex = (this.currentBeatIndex + 1) % this.slotCount;
            this.playBeatsAt(this.currentBeatIndex);
        }, noteDuration);
    }

    playBeatsAt(index, when=0) {
        this.instruments
            .filter((drum, drumPos) => this.beats[drumPos][index])
            .forEach((drum) => this.playDrum(drum, when))
        ;
    }

    stopLoop() {
        this.playing = false;
        clearInterval(this.loopInterval);
        this.player.cancelQueue(this.audioContext);
    }

    playDrum(drum, when=0) {
        if(!window[drum.variable]) {
            return;
        }
        this.player.queueWaveTable(
            this.audioContext, 
            this.equalizer.input, 
            window[drum.variable], 
            when,
            window[drum.variable].zones[0].keyRangeLow, //pitch
            3, 
            this.volume
        );    
    }

    set(drum, beat) {
        this.beats[drum][beat] = true;
    }

    unset(drum, beat) {
        this.beats[drum][beat] = false;
    }

    toggle(drum, beat) {
        this.beats[drum][beat] = !this.beats[drum][beat];
        if(!this.beats[drum][beat]) {
            console.log("Set to false");
        }
    }
    
    get initialized() {
        return this.player !== undefined;
    } 
}