//dont play here
var host = 'travis.durieux.me';
var protocol = "wss";
var ws = null;

var jobsPython = [];
var jobsPhp = [];
var jobsCpp = [];
var jobsCsharp = [];

var reduction = true;

function reductionSwitch() {
    if (reduction = true){
        reduction = false;
    } else if (reduction= false) {
        reduction = true;
    }
}

setInterval(reductionSwitch, 100);

//=====================================================================================

function startSimulation() {
    //geting canvas by id c
    var c = document.getElementById("c");
    var ctx = c.getContext("2d");

    //making the canvas full screen
    c.height = window.innerHeight;
    c.width = window.innerWidth;

    //chinese characters - taken from the unicode charset
    var matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%あいうえおかきくけこがぎぐげごさしすせそざじずぜぞたちつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもやゆよらりるれろわゐゑを";
    //converting the string into an array of single characters
    matrix = matrix.split("");

    var font_size = 10;
    var columns = c.width / font_size; //number of columns for the rain
    //an array of drops - one per column
    var drops = [];

//=========================================================================================

    var onmessage = function (e) {
        // basic check if the message is in JSON format
    	if (e.data[0] != '{') return;
        var data = JSON.parse(e.data) 

        if (data.event = 'job') {

            if (reduction == false) {
                drawDrops();
            } else if (reduction == true) {}

        }



    };

    //trying new things
    //x below is the x coordinate
    //1 = y co-ordinate of the drop(same for every drop initially)
    for(var x = 0; x < columns; x++)
        drops[x] = 1; 

    //drawing the characters
    function draw() {
        //Black BG for the canvas
        //translucent BG to show trail
        ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
        ctx.fillRect(0, 0, c.width, c.height);

        ctx.fillStyle = "#0F0"; //green text
        ctx.font = font_size + "px arial";
        //looping over drops
        for( var i = 0; i < drops.length; i++ )
        {
            //a random character to print
            var text = matrix[ Math.floor( Math.random() * matrix.length ) ];
            //x = i*font_size, y = value of drops[i]*font_size
            ctx.fillText(text, i * font_size, drops[i] * font_size);

            //incrementing Y coordinate
            drops[i]++;
        }
    }

    function drawDrops() {
            for(var i = 0; i < drops.length; i++)
            if( drops[i] * font_size > c.height && Math.random() > 0.900) {
                drops[i] = 0;
            }
    }

    setInterval(draw, 35 );

//=======================================================================

function postColor(colors, id) {
    fetch('https://ci-lights.azurewebsites.net/setcolor', {
            method: 'post',
            body: JSON.stringify({
                id: id,
                color: [57, 255, 20],
                session: '7up',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => console.log(res));
}

//=======================================================================
    //function to start websocket
    function startWS(){
        ws = new WebSocket(protocol + '://' + host);
        if (onmessage != null) {
            ws.onmessage = onmessage;
        }
        ws.onclose = function(){
            // Try to reconnect in 5 seconds
            setTimeout(function(){startWS()}, 5000);
        };
    }
    
//=====================================================================
//start the websocket and start music and sound
    startWS();
    document.getElementById('start').style.opacity = 0;
    var audio = document.getElementById("myAudio");
    audio.play();
};

