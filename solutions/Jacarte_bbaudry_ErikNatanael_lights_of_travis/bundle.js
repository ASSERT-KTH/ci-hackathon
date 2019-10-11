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

        const data = {
            id: parseInt(Math.random()*25),
            color: [0,255,0],
            session : 'test'
        }
        fetch(`http://192.168.1.157:8000/setcolor`, {method: 'POST', data, mode: 'cors'})
        .then(function (data) {
            console.log(data)
        })
        .catch(function (error) {
            console.log(error);
        });

    }

    
}



// Entrypoint
document.addEventListener('DOMContentLoaded', function(){ // When page is completly loaded
    ////drawDebug()
    
   start()
}, false);
},{}]},{},[1]);
