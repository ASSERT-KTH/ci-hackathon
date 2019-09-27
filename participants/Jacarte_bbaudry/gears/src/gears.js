const Tone = require("./libs/tone.js");


ws = new WebSocket('wss://travis.durieux.me');
//const maxNumberTracks = 25; //maximum number of tracks (CI jobs) that we listen to in parallel

/* I think there's a similar pen somewhere else, but I wasn't able to find it 

* UPDATE - Godje sent me his similar pen:
https://codepen.io/Godje/post/spinning-stars-mechanics
*/

let jobs = {

}

function getRadius(message){

    const lang = message.data.config.language;

    switch (lang) {
        // script languages and platforms
        case 'php':
        case 'r':
        case 'python':
        case 'groovy':
        case 'perl':
        case 'perl6':
            return [0, 1];

        // systems
        case 'android':
        case 'c':
        case 'go':
        case 'nix':
        case 'rust':
        case 'bash':
            return [1, 2];

        // frontend/client
        case 'node_js':
        case 'dart':
        case 'elm':
        case 'swift':
        case 'js':
        case 'objective-c':
            return [2, 3];

        // backend 
        case 'haskell':
        case 'd':
        case 'crystal':
        case 'clojure':
        case 'elixir':
        case 'erlang':
        case 'ruby':
            return [3, 4];

        // Apps
        case 'scala':
        case 'c#':
        case 'haxe':
        case 'c++':
        case 'cpp':
        case 'smalltalk':
        case 'julia':
        case 'java':
            return [5, 7];
        

        case 'erlang':
                return [8, 9];
        
    }

    return undefined
}


function getColor(message){

    if(!message)
        return '#000000'

    const lang = message.data.config.language;

    switch (lang) {
        // script languages and platforms
        case 'php':
        case 'r':
        case 'python':
        case 'groovy':
        case 'perl':
        case 'perl6':
            return '#ffeede';

        // systems
        case 'android':
        case 'c':
        case 'go':
        case 'nix':
        case 'rust':
        case 'bash':
            return '#fdb94d';

        // frontend/client
        case 'node_js':
        case 'dart':
        case 'elm':
        case 'swift':
        case 'js':
        case 'objective-c':
            return '#ee303a';

        // backend 
        case 'haskell':
        case 'd':
        case 'crystal':
        case 'clojure':
        case 'elixir':
        case 'erlang':
        case 'ruby':
            return '#471b34';

        // Apps
        case 'scala':
        case 'c#':
        case 'haxe':
        case 'c++':
        case 'cpp':
        case 'smalltalk':
        case 'julia':
        case 'java':
            return '#97d7df';
        

        case 'erlang':
                return '#ee303a';
        
    }

    return undefined;
}


function handleJob(message){

    console.log(message)

    if (message.data.state === "started") {
                
        let ring = assignRing(message)

        if(ring){   
            ring.id = message.data.commit.id
            jobs[ring.id] = message
            jobs[ring.id].ring = ring

            
            let synth = createSynth(ring.position)
            let sound = soundForJob(message)

            
            synth.triggerAttackRelease(sound, '4n');
        }
         
    }
    else {
        if ((message.data.commit.id in jobs)) {



            if(message.data.state === "finished" || message.data.state === "errored" || message.data.state === "failed" || message.data.state === "passed"){
                
                let key = message.data.commit.id
                
                mergeRing(key, message)
            }

            const fmSynth = new Tone.FMSynth().toMaster()

            const scSynth = new Tone.MetalSynth({
                "harmonicity" : 17,
                "resonance" : 100,
                "modulationIndex" : 10,
                "octaves" : 2.3,
                "envelope" : {
                    "decay" : 0.21,
                    "release" : 0.49,
                    "attack" : 0.01,
                    "sustain": 0.07
                },
                "volume" : 30

            }).toMaster();

            let state = message.data.state

            console.log("PLaying?")
            switch(state){
                case "passed":
                    //color = '#42f5ce55'; // green
                    scSynth.triggerAttackRelease("A1", "8n")
                    break;
                case "errored":
                    //color = '#0088ff55'; // blue
                    scSynth.triggerAttackRelease("F1", "8n")
                    break;
                case "finished":
                    //color = '#ffbf0055'; // yellow
                    scSynth.triggerAttackRelease("B1", "8n")
                    break;
                case "failed":
                    //color = 'ff000055'; // gray
                    scSynth.triggerAttackRelease("G1", "8n")
                    break;
            }
            // Todo sound or splash


            //delete jobs[message.data.commit.sha]


        }
    }
}


ws.onmessage = function (event) {
    const message = JSON.parse(event.data);
    handleJob(message)
}

function mergeRing(commitId, message){

    let ring= getRing(commitId)

    if(ring){
        let size = ring.chunks.length - 1

        if(size == 0){

            jobs[commitId].ring.id = undefined
            delete  jobs[commitId]
        }
        else{
            splitRing(message, ring, ring.chunks.size - 1)
        }
    }

}

function splitRing(message, ring, size){

    let theta = Math.PI*2/size;

    ring.chunks = []

    let last = 0
    for(let i = 0; i < size; i++){
        ring.chunks.push([last, last + theta - 0.2])
        last += theta;
    }

    return ring
}

function getRing(id){
    for(let ring of rings)
        if(ring.id === id)
            return ring
    return undefined
}

function assignRing(message){

    for(let ring of rings)
        if(ring.id === message.data.commit.id)
            return splitRing(message, ring, ring.chunks.length + 1)

    //let radiusRange = getRadius(message)
    
    //if(radiusRange){
    //    let scale = radius.length/6

    //    let min, max
    //    min = scale * radiusRange[0] * width
    //    max = scale*radiusRange[1] * width


        for(let ring of rings){
            if(!ring.id)// && ring.innerRadius >= min && ring.innerRadius <= max)
                return ring
        }
    //}

    return undefined
}


let ctx, r;
const w = 1200, h = 1200, TAU = 2*Math.PI, MAX_R = 1500;

const colors = ["#ff000080", "#00ff0080", "#0000ff80", "#00ffff80"]
let width = 10

function getRandom(min, max){
    return min + Math.random()*(max - min)
}

function getRandomInt(min, max){
    return parseInt(Math.random() *(max- min )+ min)
}

function createRings(x, y, width, count, setRadius, which){


    for(let i = 1; i <= count; i++){
        // for each ring

        let innerRadius = i*width;

        if(setRadius)
            radius.push(innerRadius)

        rings.push({
            color: "#000000",
            innerRadius,
            center: [x, y],
            chunks: [[0, Math.PI*2]],
            id: undefined,
            position: which, // Left or right side
            direction: i %2 == 0? -speed/i: speed/i,
            outerRadius: width + innerRadius
        })
        
        
    }

}

function setup(){

	r, canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    
    createRings(w/4, h/2, 10, 50, true, "left")
    createRings(3*w/4, h/2, 10, 50, false, "right")

    requestAnimationFrame(draw);
    
}

let speed = 4
let globalTime  = 0
let step = 0.005
let space = 0

let rings = [

]
let radius = []

// To paint it
function createRing(x, y, innerRadius, outerRadius, fromTheta, toTheta, color){

    ctx.beginPath();
    ctx.arc(x, y, innerRadius, fromTheta, toTheta);
    ctx.strokeStyle = color;
    ctx.lineWidth = outerRadius - innerRadius - space;
    ctx.stroke();

    //2 * Math.PI
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
        case 'c++':
        case 'cpp':
        case 'smalltalk':
        case 'julia':
        case 'java':
            return 'D4';
        

        case 'erlang':
                return 'E2';
        
    }

    console.log("Not analyzed " + lang)
    return undefined;
}


function createSynth(position){

    

    let which = null;

    if(position === 'left'){
        which = new Tone.Panner(-1);
    }
    else{
        which = new Tone.Panner(1);
    }

    
    
    let synth =  new Tone.Synth({
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


    synth.chain(which, Tone.Master)

    return synth;
}


function draw(){
    
    globalTime += step

    ctx.clearRect(0,0, w, h)
    for(var ring of rings){
        for(var chunk of ring.chunks){

            createRing(ring.center[0], ring.center[1], ring.innerRadius, 
                
                ring.outerRadius, chunk[0] + ring.direction*globalTime, 
                chunk[1] + globalTime*ring.direction, 
                ring.id === undefined? '#00000088': getColor(jobs[ring.id]))
        }
    }

    requestAnimationFrame(draw);
    
    // 60 
}

window.onload = setup;