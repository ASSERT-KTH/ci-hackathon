(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

//Establish the WebSocket connection and set up event handlers
var webSocket = new WebSocket("ws://" + location.hostname + ":" + location.port + "/game/");
webSocket.onmessage = function (msg) { parseEvent(msg); };
webSocket.onclose = function () { alert("WebSocket connection closed") };



var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    width = 1400,
    height = 800,
    players = [],
    keys = [],
    friction = 0.8,
    wallBump = 0,
    airFriction = 0.99,
    maxDx = 8,
    wallJumpTolerance = 25,
    gravity = 0.4,
    boxes = [],
    powerup = [],
    events = [],
    myId = 0,
    canJump;

canvas.width = width;
canvas.height = height;

function trajectoryChange() {
    webSocket.send(JSON.stringify({
      t: 0,
      playerId: myId,
      timestamp: 0,
      x: players[myId].x,
      y: players[myId].y,
      dx: players[myId].dx,
      dy: players[myId].dy
    }));
}

function getColor(raw) {
    return "#"+ ('000000' + ((raw)>>>0).toString(16)).slice(-6);
}

function log(txt) {
    var logDiv = document.getElementById('log');
    logDiv.innerText += txt + "\n";
    logDiv.scrollTop = logDiv.scrollHeight;
}

function parseEvent(msg) {
   var event = JSON.parse(msg.data);

    //log("received: " + JSON.stringify(event));

	//TrajectoryChangeMessageType = 0;
	//NewBlockMessageType = 1;
	//NewPlayerMessageType = 2;
	//PlayerDeathMessageType = 3;

    if(event.t == 0) {
        //TrajectoryChangeMessageType
        players[event.playerId].x = event.x;
        players[event.playerId].y = event.y;
        players[event.playerId].dx = event.dx;
        players[event.playerId].dy = event.dy;

    } else if (event.t == 1) {
        log("box");
        //NewBlockMessageType
        boxes[event.boxId] = {
            boxId: event.boxId,
            x: event.x,
            y: event.y,
            w: event.w,
            h: event.h,
            gravity: event.gravity,
            dx: event.dx,
            dy: event.dy,
            color: getColor(event.color)
        };
    } else if (event.t == 2) {
        //NewPlayerMessageType
        players[event.playerId] = {
            id: event.playerId,
            x: event.x,
            y: event.y,
            w: event.w,
            h: event.h,
            speed: event.speed,
            gravity: event.gravity,
            dx: event.dx,
            dy: event.dy,
            color1: getColor(event.color1),
            color2: getColor(event.color2),
        };
    } else if (event.t == 3) {
        //PlayerDeathMessageType
        delete players[event.playerId];
    } else if (event.t == 4) {
        //IdAssignementMessage
        myId = event.playerId;
    } else if (event.t == 5) {
        //DeleteBoxMessage
        delete boxes[event.boxId];
    }
}


function update() {
    //empty events
    physic();
    //draw elements (boxes, item, players)
    drawElements();
    //check for collisions
    //check for keys
    processInputs();

    requestAnimationFrame(update);
}

function processInputs() {
    /*if((keys[32] || keys[38]) && canJump) {
        players[myId].dy = -12;
        trajectoryChange();
    }*/
    if(keys[37]){
        players[myId].dx -= 1;
        trajectoryChange();
    }
    if(keys[39]){
        players[myId].dx += 1;
        trajectoryChange();
    }
}

function physic() {

    for (i in boxes) {
        var box = boxes[i];
        box.y += box.gravity;
        if(box.y > height) {
            //delete boxes[i];
        }
    }

    canJump = false;

    for (i in players) {
        var player = players[i];
        player.dy += gravity;
        player.y += player.dy;


        var grounded = false;
        for (j in boxes) {
            cj = colCheck(player, boxes[j]);
            grounded |= (cj == 'b');
            if(player.id == myId) {
                //canJump |= cj;
                cj = canJumpCol(player, boxes[j]);
                canJump |= (cj != '0' && cj != 't');
            }
        }

        if(grounded) {
            player.dx *= friction;
        } else {
            player.dx *= airFriction;
        }
        if(player.dx > maxDx) {
            player.dx = maxDx;
        } else if(player.dx < -maxDx) {
            player.dx = -maxDx;
        }

        player.x += player.dx;
    }
}

function colCheck(player, obj) {
    // get the vectors to check against
    var vX = (player.x + (player.w / 2)) - (obj.x + (obj.w / 2)),
        vY = (player.y + (player.h / 2)) - (obj.y + (obj.h / 2)),
        // add the half widths and half heights of the objects
        hWidths = (player.w / 2) + (obj.w / 2),
        hHeights = (player.h / 2) + (obj.h / 2),
        col = '0';

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                col = 't';
                player.y += oY;
                player.dy = 0;
            } else {
                col = 'b';
                player.y -= oY;
                player.dy = 0;
            }
        } else {
            if (vX > 0) {
                col = 'l';
                player.x += oX + 1;
                player.dx = -(player.dx - wallBump);
            } else {
                col = 'r';
                player.x -= oX + 1;
                player.dx = -(player.dx + wallBump);
            }
        }
    }
    return col;
}

function canJumpCol(player, obj) {
     // get the vectors to check against
     var vX = (player.x + (player.w / 2)) - (obj.x + (obj.w / 2)),
         vY = (player.y + (player.h / 2)) - (obj.y + (obj.h / 2)),
         // add the half widths and half heights of the objects
         hWidths = (player.w / 2) + (obj.w / 2) + wallJumpTolerance,
         hHeights = (player.h / 2) + (obj.h / 2) + 1,
         col = '0';

     // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
     if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
         // figures out on which side we are colliding (top, bottom, left, or right)
         var oX = hWidths - Math.abs(vX),
             oY = hHeights - Math.abs(vY);
         if (oX >= oY) {
             if (vY > 0) {
                 col = 't';
             } else {
                 col = 'b';
             }
         } else {
             if (vX > 0) {
                 col = 'l';
             } else {
                 col = 'r';
             }
         }
     }
     return col;
 }

function drawElements() {
    ctx.clearRect(0, 0, width, height);
    for (i in boxes) {
        var box = boxes[i];
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x, box.y, box.w, box.h);
    }
    for (i in players) {
        var player = players[i];
        ctx.fillStyle = player.color1;
        ctx.fillRect(
            player.x - (player.dx / player.speed) * 4 - 4,
            player.y - (player.dy / player.speed) * 4 - 4,
            player.w + 8,
            player.h + 8
        );
        ctx.fillStyle = player.color2;
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }
}



document.body.addEventListener("keydown", function(e) {
    if((e.keyCode == 32 || e.keyCode == 38) && !keys[e.keyCode] && canJump) {
        players[myId].dy = -12;
        trajectoryChange();
        //log("jump");
    }
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function() {
    update();
});