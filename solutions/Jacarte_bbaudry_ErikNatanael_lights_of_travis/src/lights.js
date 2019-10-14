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