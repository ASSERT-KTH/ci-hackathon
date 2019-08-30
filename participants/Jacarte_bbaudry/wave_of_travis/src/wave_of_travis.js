const Tone = require("./libs/tone.js");


ws = new WebSocket('wss://travis.durieux.me');
//const maxNumberTracks = 25; //maximum number of tracks (CI jobs) that we listen to in parallel
const maxNumberOfJobs = 1000;

var globalCount = 0; //this counter keeps increasing and records the total number of jobs that have been played since page load

const jobs = {}
var jobsCounter = 0;

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const debug = document.getElementById("debug");
const debugContext = debug.getContext("2d");


function start() {
    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        //console.log(message);
        //changeSize(message);
        handleJobPlay(message);
        updateJobState(message);
    }

    
}

//for the moment we consider only two situations: the job starts and we play; the job stops and we stop playing
//we should consider more: alter the sound when the job is updated (but not finished); play something different depending on the final state of the job (errored, failed, passed)

function updateJobState(message){
    const key = message.data.commit.sha;


    if(key in jobs){
        const state = message.data.state;
        let color = '#ffffff44';


        switch(state){
            case "passed":
                color = '#42f5ce55'; // green
                break;
            case "errored":
                color = '#0088ff55'; // blue
                break;
            case "finished":
                color = '#ffbf0055'; // yellow
                break;
            case "failed":
                color = 'ff000055'; // gray
                break;
        }

        jobs[key].color = color;
    }
}

function addSynth(message){
    const key = message.data.commit.sha;

    if(key in jobs){
        jobs[key].synth = createSynth();
        
        
        //assign a synth to the sha of the input message
        const synth = jobs[key].synth;

        //have the synth play the soundthat corresponds to the job
        const sound = soundForJob(message)

        if(sound !== undefined){
            console.log(sound, message.data.config.language)
            jobs[key].playingNote = sound;


            var newVisitors =  jobs[key].drawVisitors.concat((self, context) => {
                
                var radius = !self.stopped? maxSizeWave*Math.abs(Math.sin(self.timer*3)): 0;
                drawCircle(self.starting[0], self.starting[1], radius, context, 'transparent', '#5DBCD2');
            })

            jobs[key].drawVisitors = newVisitors;

            
            synth.triggerAttackRelease(sound, '4n');

        }
    }
}

function handleJobPlay(message) {

    // Update drawing jobs
    if (message.data.state === "started") {
        putJob(message);
        addSynth(message) // play start sound
        jobsCounter++;
        console.log(message.data.state)
    }
    else {
        if ((message.data.commit.sha in jobs && message.data.state === "finished" || message.data.state === "errored" || message.data.state === "failed" || message.data.state === "passed")) {
            stopPlayJob(message);
            globalCount = globalCount + 1;
            jobsCounter--;
        }
    }
}

function drawCircle(x, y, radius, context, fillColor, strokeColor){

    if(radius < 1){
        return;
    }

    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    
    context.fillStyle = fillColor;
    context.strokeStyle = strokeColor;

    context.fill();
    context.stroke();
}


function drawCanvas(jobs){


    context.clearRect(0, 0, canvas.width, canvas.height);

    for(const key in jobs){

        const info  = jobs[key];

        //console.log(info.drawVisitors)
        
        for(func of info.drawVisitors){
            func(info, context)
        }
        //console.log("drawing canvas", info.starting, info.counter);
    }
    
}

function getJob(index){

    for(key in jobs)
        if(jobs[key].index === index)
            return jobs[key];
    
    return null;
}

let index = 0;
let maxSizeWave = 40;
let step = 0.01;
let stopRadius = 10;

function createSynth(){
    return new Tone.Synth({
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
}

function putJob(message) {
    //add the job in the list of jobs being played
    
    if(Object.keys(jobs).length >= maxNumberOfJobs || message.data.commit.sha in jobs)
        return;
    
    const key = message.data.commit.sha;
    
    let newIndex = index;

    index = (index + 1);
    jobs[key] = {
        interval: null,
        radius: 0,
        direction: 1,
        stopped: false,
        timer: 0,
        color: '#11111111',
        index: newIndex,
        starting: [ Math.random()*canvas.width, Math.random()*canvas.height], // 2d random space point in canvas
        playingNote: '',
        drawVisitors: [(self, context) => {
            var radius = !self.stopped? maxSizeWave*Math.abs(Math.sin(self.timer)): stopRadius;
            drawCircle(self.starting[0], self.starting[1], radius, context, self.color, 'gray');
        },],
        synth: null
    };

    jobs[key].interval = setInterval(function() {
        jobs[key].timer += step;
    }, 10);


    //drawDebug();
}

function stopPlayJob(message) {
    //remove the job from the list of sounds being played
    const key = message.data.commit.sha;

    //console.log(key, jobs[key]);
    
    if(key in jobs){
        const toDelete = jobs[key];
        
        const synth = jobs[key].synth;
        
        jobs[key].stopped = true;

        //playing special sound for the end of the job
        synth.triggerRelease();
        synth.triggerAttackRelease('F#3', '4n');
                
        clearInterval(jobs[key].interval);
    }

    //drawDebug();
    //document.write("<p>".concat(message.data.commit.sha).concat(" is done: ").concat(message.data.state).concat(".We listened to ").concat(Object.keys(jobs).length).concat(" sounds.</p>"));
}

function soundForJob(message) {
    const lang = message.data.config.language;

    switch (lang) {
        // script languages and platforms
        case 'php':
        case 'r':
        case 'python':
        case 'groovy':
        case 'perl':
        case 'perl6':
            return 'B3';

        // systems
        case 'android':
        case 'c':
        case 'go':
        case 'nix':
        case 'rust':
        case 'bash':
            return 'G1';

        // frontend/client
        case 'node_js':
        case 'dart':
        case 'elm':
        case 'swift':
        case 'js':
        case 'objective-c':
            return 'G4';

        // backend 
        case 'haskell':
        case 'd':
        case 'crystal':
        case 'clojure':
        case 'elixir':
        case 'erlang':
        case 'ruby':
            return 'D2';

        // Apps
        case 'scala':
        case 'c#':
        case 'haxe':
        case 'cpp':
        case 'smalltalk':
        case 'java':
            return 'D4';
        

        case 'erlang':
                return 'E2';
        
    }

    console.log("Not analyzed " + lang)
    return undefined;
}

first = true;

function startDemo(){

    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
    setInterval(() => drawCanvas(jobs), 50)

    start()
}

window.start = startDemo