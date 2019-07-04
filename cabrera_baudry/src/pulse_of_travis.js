const Tone = require("./libs/tone.js");


ws = new WebSocket('wss://travis.durieux.me');
const maxNumberTracks = 26; //maximum number of tracks (CI jobs) that we listen to in parallel
var globalCount = 0; //this counter keeps increasing and records the total number of jobs that have been played since page load
var playingJob = {} //keeps the list of sha values for each job being played. inv: playingJob.length < maxNumberTracks

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const debug = document.getElementById("debug");
const debugContext = debug.getContext("2d");


function start() {
    console.log("Starting");
    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        console.log(message);
        //changeSize(message);
        handleJob(message);
    }

    
}

//for the moment we consider only two situations: the job starts and we play; the job stops and we stop playing
//we should consider more: alter the sound when the job is updated (but not finished); play something different depending on the final state of the job (errored, failed, passed)

function handleJob(message) {
    if (message.data.state === "started" && Object.keys(playingJob).length <= maxNumberTracks && !(message.data.commit.sha in playingJob)) {
        playJob(message);
        console.log("Started", message);
    }
    else {
        if (message.data.commit.sha in playingJob && (message.data.state === "finished" || message.data.state === "errored" || message.data.state === "failed" || message.data.state === "passed")) {
            stopPlayJob(message);
            globalCount = globalCount + 1;
        }
        else if ( message.data.commit.sha in playingJob) {
            //document.write("<p>".concat(message.data.commit.sha).concat(" is updated to ").concat(message.data.state).concat("</p>"));
        }
    }
}

function drawCircle(x, y, radius, context, fillColor, strokeColor){

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;
    context.fill();
    context.stroke();
}

function drawCanvas(){

    context.clearRect(0, 0, canvas.width, canvas.height);

    for(const key in playingJob){

        const info  = playingJob[key];
        //console.log("drawing canvas", info.starting, info.counter);

       drawCircle(info.starting[0], info.starting[1], info.counter, context, 'white', 'black');
    
    }
    
}

function getJob(index){

    for(key in playingJob)
        if(playingJob[key].index === index)
            return playingJob[key];
    
    return null;
}

function drawDebug(){

    let square = parseInt(Math.sqrt(maxNumberTracks));
    
    debugContext.clearRect(0, 0, debug.width, debug.height);

    console.log(debug.width);
    let squareSizeW = parseInt(debug.width/square);
    let squareSizeH = parseInt(debug.height/(square + (maxNumberTracks%square == 0? 0 : 1)));
    let padding = 20;
    for(let i = 0; i < maxNumberTracks; i++){

        let x = i%square;
        let y = parseInt(i/square);

        // Draws the grid
        debugContext.strokeRect(squareSizeW*x, squareSizeH*y, squareSizeW, squareSizeH)

        const job = getJob(i);

        if(job){
            console.log(playingJob, job)
            // Write the note
            debugContext.fillText(job.playingNote, squareSizeW*(x) + padding, squareSizeH*(y + 1) - padding);
        }
    }


    debugContext.stroke();

}

let index = 0;
let maxSizeWave = 100;

function playJob(message) {
    //add the job in the list of jobs being played
    const key = message.data.commit.sha;

    let newIndex = index;

    index = (index + 1)%maxNumberTracks;
    playingJob[key] = {
        interval: null,
        counter: 0,
        index: newIndex,
        starting: [ Math.random()*canvas.width, Math.random()*canvas.height], // 2d random space point in canvas
        playingNote: '',
        synth: new Tone.Synth({
            oscillator: {
                type: 'triangle8'
            },
            envelope: {
                attack: 2,
                decay: 1,
                sustain: 0.4,
                release: 4
            }
        }).toMaster()
    };

    playingJob[key].interval = setInterval(function() {
        playingJob[key].counter = (playingJob[key].counter + 1)%maxSizeWave;
        drawCanvas();
    }, 10);


    //assign a synth to the sha of the input message
    const synth = playingJob[key].synth;

    if (synth != null) {
        //have the synth play the soundthat corresponds to the job
        const sound = soundForJob(message)
        playingJob[key].playingNote = sound;
        synth.triggerAttack(sound);
        //document.write("<p>".concat(message.data.commit.sha).concat(" plays ").concat(sound).concat(". We are listening to ").concat(Object.keys(playingJob).length).concat(" sounds</p>"));
    } else {
        //document.write("<p>".concat(message.data.commit.sha).concat(" has no synth").concat("</p>"))
    }

    drawDebug();
}

function stopPlayJob(message) {
    //remove the job from the list of sounds being played
    const key = message.data.commit.sha;

    console.log(key, playingJob[key]);
    
    const synth = playingJob[key].synth;

    //playing special sound for the end of the job
    synth.triggerRelease();
    synth.triggerAttackRelease('F#3', '4n');
            
    clearInterval(playingJob[key].interval);

    delete playingJob[key];

    drawDebug();
    //document.write("<p>".concat(message.data.commit.sha).concat(" is done: ").concat(message.data.state).concat(".We listened to ").concat(Object.keys(playingJob).length).concat(" sounds.</p>"));
}

function soundForJob(message) {
    const lang = message.data.config.language;
    console.log(lang);
    switch (lang) {
        case 'php':
            return 'C4';
        case 'python':
            return 'A4';
        case 'ruby':
            return 'F4';
        case 'perl':
            return 'B4';
        case 'node_js':
            return 'G4';
        case 'scala':
            return 'B2';
        case 'clojure':
            return 'A2';
        case 'java':
            return 'E2';
        case 'cpp':
            return 'G2';
        case 'go':
            return 'B1';
        case 'rust':
            return 'A1';
        case 'bash':
            return 'G1';
        case 'julia':
            return 'C5';
    }
    return 'D4';
}

first = true;

function changeSize(message) {

    if(first){
        const diffURL = message.data.commit.compare_url.concat(".diff");
        fetch(`http://localhost:8000/?url=${diffURL}`, {method: 'GET'})
            .then(function (data) {
                data.json().then(json => {
                    console.log(json);
                }).
                catch(err => {

                        console.log(err);
                    }
                );
            })
            .catch(function (error) {
                console.log("could not fetch diff for ".concat(message.data.commit.sha));
            });

            //first = false;

           
    }
}

// Entrypoint
document.addEventListener('DOMContentLoaded', function(){ // When page is completly loaded
    drawDebug();
    document.getElementById("start-btn").addEventListener("click", start ,false); // Add button click event
}, false);