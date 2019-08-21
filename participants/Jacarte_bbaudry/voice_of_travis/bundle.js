(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
ws = new WebSocket('wss://travis.durieux.me');

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const voice = speechSynthesis.getVoices()[0];
const maxText = 25;

const messages = {

};


function start() {
    console.log("Starting");
    ws.onmessage = function (event) {
        const message = JSON.parse(event.data);

        console.log(message);
        handleText(message,);
    }

    
}

let playing = null;

function initTextSpeechJob(msg){
    return {
        data: msg.data
    };
}

function handleText(message){

    
    
    const text =  message.data.commit.message;

    if(!(text in messages) && Object.keys(messages).length < maxText){

        messages[text] = initTextSpeechJob(message);

        var msg = new SpeechSynthesisUtterance();
        msg.voice = voice;
        msg.rate = 1;
        msg.pitch = 1;
        msg.text = text;


        speechSynthesis.speak(msg);

        msg.onstart = function(e){
            playing = {
                text: e.target.text,
                repo: messages[e.target.text].data.repository_slug
            }
        }

        msg.onend = function(e) {
            playing = null;

            delete messages[text];
        };
    }
}

function drawText(text, x, y)
{
    context.font = "20px Arial";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(text, x, y); 
}

function drawCanvas(){


    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if(playing){
        console.log(playing)
        drawText(playing.text, canvas.width/2, canvas.height/2)
        drawText(playing.repo, canvas.width/4, canvas.height/4)
    }
}

// Entrypoint
document.addEventListener('DOMContentLoaded', function(){ // When page is completly loaded
    ////drawDebug()
    
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
    document.getElementById("start-btn").addEventListener("click", start ,false); // Add button click event

    setInterval(() => drawCanvas(), 50)
}, false);
},{}]},{},[1]);
