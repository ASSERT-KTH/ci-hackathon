const axios = require('axios');
const URL = "http://localhost:8000"
//const URL = "http://192.168.0.157:8000"
export function turnOnLight(id, session, color) {
    axios.post(`${URL}/setcolor`, {
        id: id,
        session: session,
        color: color
    }).then(function (response) {
        console.log(response);
    })
        .catch(function (error) {
            console.log(error);
        });
}

export function turnOffLight(session) {
    axios.post(`${URL}/blackout`, {
        session: session
    }).then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
}

//turnOnLight("2", "main", [255, 255, 255])
//turnOffLight("main")