


const T = require('./travislistener.js');

console.log('Plays some strange sounds...');

const axios = require('axios');


let cords = [
    ['C4', 'E4', 'G4'],
    ['D4', 'F4'],
    ['F4', 'A4'],
    ['D3', 'F3'],
    ['F3', 'A3']
]

let sound = (c,d) => {
    axios.post('http://localhost:3000/notes',
               {notes: cords[c], duration: d+'n'})
}

let delay = ms => new Promise(resolve => setTimeout(resolve, ms))

T.travisListener.connect();
T.travisListener.on('job', async (job, eventType) => {
    await sound(job.id%5,16);
    await delay(300);
    await sound(job.id%5,16);
    await delay(200);
    await sound(job.id%5,16);
    await delay(300);
    await sound(job.id%5,16);
    await delay(100*job.id%3);
    await sound(job.id%5,16);
    await delay(200*job.id%3);
    console.log(job.id)
})
