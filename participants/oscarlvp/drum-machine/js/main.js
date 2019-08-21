const SLOTS = 53;
const CELLS = SLOTS * DRUM_COUNT;
const CELL_WIDTH = 12;
const DIAMETER = CELL_WIDTH - 4;
const RADIUS = DIAMETER / 2;
const CANVAS_WIDTH = SLOTS * CELL_WIDTH;
const CANVAS_HEIGHT = DRUM_COUNT * CELL_WIDTH;
const SERVER_URL = 'wss://travis.durieux.me';


let machine;
let socket; 

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    setupDrums();
    setupSocket();

}

function setupSocket() {
    let socket = new WebSocket(SERVER_URL);
    socket.onmessage = onSocketMessage;
}

function setupDrums() {
    machine = new DrumMachine(SLOTS);
}

function draw() {
    clear();
    let diameter = DIAMETER;
    let color = 0;

    if(machine &&  machine.playing) {
        fill(125)
        stroke(5);
        let x = CELL_WIDTH * (machine.currentBeatIndex + .5);
        line(x, 0, x, CANVAS_HEIGHT);
    }
    
    stroke(1);
    for(let drum = 0; drum < DRUM_COUNT; drum++) {
        for(let beat = 0; beat < SLOTS; beat++) {
            if(!machine.beats[drum][beat]) {
                continue;
            }
            if (beat == machine.currentBeatIndex) {
               color = 125;
               diameter = CELL_WIDTH; 
            }
            else {
                color = 0;
                diameter = DIAMETER
            }
            fill(color);
            circle( 
                    CELL_WIDTH * (beat + .5),
                    CELL_WIDTH * (drum + .5),
                    diameter
                );
        }
    }
}

function onSocketMessage(evt) {
    let job = JSON.parse(evt.data);
    let sequentialPosition = job.data.repository_id % CELLS;
    machine.toggle(
        Math.floor(sequentialPosition / SLOTS), // drum
        sequentialPosition % SLOTS // beat
    );
}

function keyPressed() {
    if (keyCode !== ENTER) {
        return;
    }
    toggleInstructions();
    toggleLoop();
}

function toggleLoop() {
    if(!machine.initialized) {
        machine.initialize();
    }
    if(!machine.playing) {
        machine.startLoop()
    }
    else {
        machine.stopLoop();
    }
}

function toggleInstructions() {
    instructions.style.visibility = (instructions.style.visibility === 'hidden')? 'visible' : 'hidden';
}