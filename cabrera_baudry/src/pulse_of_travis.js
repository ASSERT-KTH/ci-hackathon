const Tone = require("./libs/tone.js");


ws = new WebSocket('wss://travis.durieux.me');
const maxNumberTracks = 25; //maximum number of tracks (CI jobs) that we listen to in parallel
const synthPool = []; //array of synth used as a pool to play CI jobs
var globalCount = 0; //this counter keeps increasing and records the total number of jobs that have been played since page load
var playingJob = {} //keeps the list of sha values for each job being played. inv: playingJob.length < maxNumberTracks

window.onload = initSynthPool();
function start() {
    console.log("Starting");
    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        console.log(message);
        //changeSize(message);
        handleJob(message);
    }
}

function initSynthPool() {
    for (var i = 0; i < maxNumberTracks; i++) {
        synthPool[i] = [];
        synthPool[i][0] = new Tone.Synth({
            oscillator: {
                type: 'triangle8'
            },
            envelope: {
                attack: 2,
                decay: 1,
                sustain: 0.4,
                release: 4
            }
        }).toMaster();
        synthPool[i][1] = "no sha"; // each synth is initially available
        console.log(synthPool[i][0]);
        console.log(synthPool[i][1]);
    }
}

function assignSynth(sha) {
    console.log("look for a synth");
    for (var i = 0; i < synthPool.length; i++) {
        if (synthPool[i][1] === "no sha") {
            synthPool[i][1] = sha;
            document.write("<p>".concat("Synth ").concat(i).concat(" is assigned to job ").concat(sha).concat("</p>"));
            return synthPool[i][0];
        }
    }
}

function releaseSynth(sha) {
    console.log("release a synth");
    for (var i = 0; i < synthPool.length; i++) {
        if (synthPool[i][1] === sha) {
            synthPool[i][0].triggerRelease();
            synthPool[i][0].triggerAttackRelease('F#3', '4n');
            synthPool[i][1] = "no sha";
            document.write("<p>".concat("Synth ").concat(i).concat(" is released from job ").concat(sha).concat("</p>"));
        }
    }
}

function printArray(array) {
    console.log(array);
}

//for the moment we consider only two situations: the job starts and we play; the job stops and we stop playing
//we should consider more: alter the sound when the job is updated (but not finished); play something different depending on the final state of the job (errored, failed, passed)

function handleJob(message) {
    if (message.data.state === "started" && Object.keys(playingJob).length < maxNumberTracks && !(message.data.commit.sha in playingJob)) {
        playJob(message);
        console.log("Started", message);
    }
    else {
        if (message.data.commit.sha in playingJob && (message.data.state === "finished" || message.data.state === "errored" || message.data.state === "failed" || message.data.state === "passed")) {
            stopPlayJob(message);
            globalCount = globalCount + 1;
        }
        else if ( message.data.commit.sha in playingJob) {
            document.write("<p>".concat(message.data.commit.sha).concat(" is updated to ").concat(message.data.state).concat("</p>"));
        }
    }
}

function playJob(message) {
    //add the job in the list of jobs being played
    playingJob[message.data.commit.sha] = 1;
    //assign a synth to the sha of the input message
    const synth = assignSynth(message.data.commit.sha);
    if (synth != null) {
        //have the synth play the soundthat corresponds to the job
        const sound = soundForJob(message)
        synth.triggerAttack(sound);
        document.write("<p>".concat(message.data.commit.sha).concat(" plays ").concat(sound).concat(". We are listening to ").concat(Object.keys(playingJob).length).concat(" sounds</p>"));
    } else {
        document.write("<p>".concat(message.data.commit.sha).concat(" has no synth").concat("</p>"))
    }
}

function stopPlayJob(message) {
    //remove the job from the list of sounds being played
    delete playingJob[message.data.commit.sha];
    //release the synth that was assigned to this job
    releaseSynth(message.data.commit.sha);
    document.write("<p>".concat(message.data.commit.sha).concat(" is done: ").concat(message.data.state).concat(".We listened to ").concat(Object.keys(playingJob).length).concat(" sounds.</p>"));
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

function changeSize(message) {
    const diffURL = message.data.commit.compare_url.concat(".diff");
    console.log(diffURL);
    fetch(diffURL, { mode: 'no-cors' })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
            console.log("could not fetch diff for ".concat(message.data.commit.sha));
        });
}

// Entrypoint
document.addEventListener('DOMContentLoaded', function(){ // When page is completly loaded

    document.getElementById("start-btn").addEventListener("click", start ,false); // Add button click event
}, false);