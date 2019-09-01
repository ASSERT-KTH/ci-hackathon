const Tone = require("./libs/tone.js");


ws = new WebSocket('wss://travis.durieux.me');
//const maxNumberTracks = 25; //maximum number of tracks (CI jobs) that we listen to in parallel

/* I think there's a similar pen somewhere else, but I wasn't able to find it 

* UPDATE - Godje sent me his similar pen:
https://codepen.io/Godje/post/spinning-stars-mechanics
*/

let ctx, thetas = [];
const w = 1200, h = 1200, TAU = 2*Math.PI, MAX_R = 500;
const mw = parseInt(w/2), mh = parseInt(h/2);

const maxJobs = 1000

const jobs = {

}
function getColor(message){
    const lang = message.data.config.language;

    switch (lang) {
        // script languages and platforms
        case 'php':
        case 'r':
        case 'python':
        case 'groovy':
        case 'perl':
        case 'perl6':
            return '#58f4f444';

        // systems
        case 'android':
        case 'c':
        case 'go':
        case 'nix':
        case 'rust':
        case 'bash':
            return '#ff000044';

        // frontend/client
        case 'node_js':
        case 'dart':
        case 'elm':
        case 'swift':
        case 'js':
        case 'objective-c':
            return '#ffbf0044';

        // backend 
        case 'haskell':
        case 'd':
        case 'crystal':
        case 'clojure':
        case 'elixir':
        case 'erlang':
        case 'ruby':
            return '#ff00bf44';

        // Apps
        case 'scala':
        case 'c#':
        case 'haxe':
        case 'c++':
        case 'cpp':
        case 'smalltalk':
        case 'julia':
        case 'java':
            return '#40ff0044';
        

        case 'erlang':
                return '#ffff0044';
        
    }

    return undefined;
}

function randomRange(min, max){
    return min + Math.random()*(max - min)
}

function getRadius(message){

    const lang = message.data.config.language;
    let r = MAX_R;

    switch (lang) {
        // script languages and platforms
        case 'php':
        case 'r':
        case 'python':
        case 'groovy':
        case 'perl':
        case 'perl6':
            r = randomRange(10, MAX_R/8)
            break;

        // systems
        case 'android':
        case 'c':
        case 'go':
        case 'nix':
        case 'rust':
        case 'bash':
            r = randomRange(MAX_R/8, MAX_R/7)
            break;

        // frontend/client
        case 'node_js':
        case 'dart':
        case 'elm':
        case 'swift':
        case 'js':
        case 'objective-c':
            r = randomRange(MAX_R/7, MAX_R/6)
            break;

        // backend 
        case 'haskell':
        case 'd':
        case 'crystal':
        case 'clojure':
        case 'elixir':
        case 'erlang':
        case 'ruby':
            r = randomRange(MAX_R/6, MAX_R/5)
            break;

        // Apps
        case 'scala':
        case 'c#':
        case 'haxe':
        case 'c++':
        case 'cpp':
        case 'smalltalk':
        case 'julia':
        case 'java':
            r = randomRange(MAX_R/5, MAX_R/4)
            break;
        

        case 'erlang':
            r = randomRange(MAX_R/4, MAX_R/3)
            break;
        
    }

    return 2*Math.random() - 1 < 0? r: -r;
}

function putJob(message){
    const key = message.data.commit.sha

    const job = {
        color: getColor(message),
        radius: getRadius(message),
        theta: Math.random()*TAU
    }

    if(job.color){
        console.log(job)
        jobs[key] = job
    }
}

function handleJob(message){
    if (message.data.state === "started" && Object.keys(jobs).length < maxJobs) {
        putJob(message);
    }
    else {
        if ((message.data.commit.sha in jobs)) {

            // Todo sound or splash

            delete jobs[message.data.commit.sha]
        }
    }
}

function setup(){

    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);
        handleJob(message)
    }

	let r, canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');

	requestAnimationFrame(draw);
}

let globalTime = 0
let step = 0.01

function draw(){
    let r, p, x, y;
    
    for(const key in jobs){
        const job = jobs[key]

        /*for(r = 1; r < MAX_R; r++){
            p = 2*Math.random()*Math.PI/r;
            thetas[r] += (Math.random() > 0.5) ? p : -p;
            x = r*Math.cos(thetas[r]);
            y = r*Math.sin(thetas[r]);
            
            ctx.fillStyle = colors[(r) % colors.length];
            ctx.beginPath();
        
            ctx.arc(mw + x, mw + y, 2, 0, TAU, true);
            ctx.arc(mh - x, mh + y, 2, 0, TAU, true);
            ctx.fill();
        }*/

        for(let i = 0; i < 100; i++){

            r = job.radius
            p = 2*Math.random()*Math.PI/r
            x = r*Math.cos(job.theta + Math.random()*TAU);
            y = r*Math.sin(job.theta + Math.random()*TAU);
            


            ctx.fillStyle = job.color
            ctx.beginPath();
        
            ctx.arc(mw + x, mw + y, 1, 0, TAU, true);
            ctx.arc(mh - x, mh + y, 1, 0, TAU, true);
            ctx.fill();
        }

    }

    globalTime += step

	requestAnimationFrame(draw);
}

window.onload = setup;