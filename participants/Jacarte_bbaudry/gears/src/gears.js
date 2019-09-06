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
            return '#58f4f488';

        // systems
        case 'android':
        case 'c':
        case 'go':
        case 'nix':
        case 'rust':
        case 'bash':
            return '#ff000088';

        // frontend/client
        case 'node_js':
        case 'dart':
        case 'elm':
        case 'swift':
        case 'js':
        case 'objective-c':
            return '#ffbf0088';

        // backend 
        case 'haskell':
        case 'd':
        case 'crystal':
        case 'clojure':
        case 'elixir':
        case 'erlang':
        case 'ruby':
            return '#ff00bf88';

        // Apps
        case 'scala':
        case 'c#':
        case 'haxe':
        case 'c++':
        case 'cpp':
        case 'smalltalk':
        case 'julia':
        case 'java':
            return '#40ff0088';
        

        case 'erlang':
                return '#ffff0088';
        
    }

    return undefined;
}

function handleJob(message){
    if (message.data.state === "started") {
        console.log("Starting", message)
                
        let ring  = pickEmptyRing(message)
        if(ring){   
            ring.sha1 = message.data.commit.sha
            jobs[ring.sha1] = message
            jobs[ring.sha1].ring = ring
        }
         
    }
    else {
        if ((message.data.commit.sha in jobs)) {



            if(message.data.state === "finished" || message.data.state === "errored" || message.data.state === "failed" || message.data.state === "passed"){
                
                console.log("update", message)
                let key = message.data.commit.sha
                
                jobs[key].ring.sha1 = undefined
                delete  jobs[key]
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


function pickEmptyRing(message){


    //let radiusRange = getRadius(message)
    
    //if(radiusRange){
    //    let scale = radius.length/6

    //    let min, max
    //    min = scale * radiusRange[0] * width
    //    max = scale*radiusRange[1] * width


        for(let ring of rings){
            if(!ring.sha1)// && ring.innerRadius >= min && ring.innerRadius <= max)
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

function createRings(x, y, width, count, setRadius){


    for(let i = 1; i <= count; i++){
        // for each ring

        let innerRadius = i*width;
        let theta = 0

        let minimum = 0
        let minAngle = Math.PI/20
        let maxAngle = Math.PI/5

        if(setRadius)
            radius.push(innerRadius)

        for(;;){

            let randomTheta = getRandom(minimum, maxAngle + minimum)
            let finalTheta = getRandom(randomTheta + minAngle, Math.PI/2 + randomTheta + minAngle)


            if( Math.PI*2 - finalTheta < 0.02)
                break;

            rings.push({
                color: "#000000",
                innerRadius,
                theta: randomTheta,
                center: [x, y],
                finalTheta,
                sha1: undefined,
                direction: i %2 == 0? -speed/i: speed/i,
                outerRadius: width + innerRadius
            })
            
            minimum = finalTheta;
        }
    }

}

function setup(){

	r, canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    
    createRings(w/4, h/2, 10, 30, true)
    createRings(3*w/4, h/2, 10, 30)

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

function draw(){
    
    globalTime += step

    ctx.clearRect(0,0, w, h)
    for(var ring of rings){

        createRing(ring.center[0], ring.center[1], ring.innerRadius, 
            
            ring.outerRadius, ring.theta + ring.direction*globalTime, 
            ring.finalTheta + globalTime*ring.direction, 
            ring.sha1 === undefined? '#00000088': getColor(jobs[ring.sha1]))
    }

    requestAnimationFrame(draw);
    
    // 60 
}

window.onload = setup;