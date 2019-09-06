const Tone = require("./libs/tone.js");


ws = new WebSocket('wss://travis.durieux.me');
//const maxNumberTracks = 25; //maximum number of tracks (CI jobs) that we listen to in parallel

/* I think there's a similar pen somewhere else, but I wasn't able to find it 

* UPDATE - Godje sent me his similar pen:
https://codepen.io/Godje/post/spinning-stars-mechanics
*/

let ctx, r;
const w = 1200, h = 1200, TAU = 2*Math.PI, MAX_R = 1500;

const colors = ["#ff000080", "#00ff0080"]

function getRandom(min, max){
    return min + Math.random()*(max - min)
}

function setup(){

	r, canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    
    let width = 40

    for(let i = 1; i <= 6; i++){
        // for each ring

        let innerRadius = i*width;
        let theta = 0

        let minimum = 0
        let minAngle = Math.PI/20
        let maxAngle = Math.PI*2

        for(;;){

            let randomTheta = getRandom(minimum, maxAngle)
            let finalTheta = getRandom(randomTheta + minAngle, maxAngle)

            console.log(randomTheta, finalTheta)

            if( Math.PI*2 - finalTheta < 0.02)
                break;

            rings.push({
                color: colors[1],
                innerRadius,
                theta: randomTheta,
                finalTheta,
                outerRadius: width + innerRadius
            })
            minimum = finalTheta;
        }
    }

    requestAnimationFrame(draw);
    
}

let globalTime  = 0
let step = 0.01

let rings = [

]

// To paint it
function createRing(innerRadius, outerRadius, fromTheta, toTheta, color){

    let x, y;
    x = w/2;
    y = h/2;

    ctx.beginPath();
    ctx.arc(x, y, innerRadius, fromTheta, toTheta);
    ctx.strokeStyle = color;
    ctx.lineWidth = outerRadius - innerRadius - 10;
    ctx.stroke();

    //2 * Math.PI
}

function draw(){
    
    globalTime += step

    ctx.clearRect(0,0, w, h)
    for(var ring of rings){

        createRing(ring.innerRadius, ring.outerRadius, ring.theta, 
            ring.finalTheta, ring.color)
    }

    requestAnimationFrame(draw);
    
    // 60 
}

window.onload = setup;