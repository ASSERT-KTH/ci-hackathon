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
    players = [],
    keys = [],
    boxes = [],
    powerup = [],
    events = [];

var width = 1400,
    height = 800,
    friction = 0.90,
    wallBump = 4,
    airFriction = 0.95,
    maxDx = 8,
    maxSlidingDy = 8,
    maxDy = 20,
    wallJumpTolerance = 2,
    myId = 0,
    canJump = false,
    doJump = false,
    alive = false;


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
        //log("box");
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
            color: getColor(event.color),
            type: event.type,
            ttl: -1
        };
    } else if (event.t == 2) {
        //NewPlayerMessageType
        players[event.playerId] = {
            id: event.playerId,
            x: event.x,
            y: event.y,
            w: event.w,
            h: event.h,
            jump: event.jump,
            speed: event.speed,
            gravity: event.gravity,
            dx: event.dx,
            dy: event.dy,
            color1: getColor(event.color1),
            color2: getColor(event.color2),
        };
        if(alive && myId == event.playerId) {
            var colTd = document.getElementById('colors');
            colTd.style["background-color"] = players[myId].color1;
            colTd.style["color"] = players[myId].color2;
        }
    } else if (event.t == 3) {
        log("Player " + event.playerId + " died");
        if(event.playerId == myId) {
            alert("      GAME OVER!\n" +
            "    ----------------------\n" +
            "Refresh to play again.")
            alive = false;
        }
        //PlayerDeathMessageType
        delete players[event.playerId];
    } else if (event.t == 4) {
        //IdAssignementMessage
        myId = event.playerId;
        alive = true;

    } else if (event.t == 5) {
        //DeleteBoxMessage
        delete boxes[event.boxId];
    }
}

var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function update() {
    requestAnimationFrame(update);

    now = Date.now();
    delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);

        //check for collisions
        physic();

        //draw elements (boxes, item, players)
        drawElements();

        //check for keys
        processInputs();
    }
}

function processInputs() {
    if(alive) {
        if(doJump) {
            players[myId].dy = -players[myId].jump;
            if(!players[myId].grounded && players[myId].sliding_left) {
                players[myId].dx = 3 * maxDx;
                players[myId].x += 2;
            } else if (!players[myId].grounded && players[myId].sliding_right) {
                players[myId].dx = -3 * maxDx;
                players[myId].x -= 2;
            }
            trajectoryChange();
            //log("jump");
            doJump = false;
        }
        /*if((keys[32] || keys[38]) && canJump) {
            players[myId].dy = -12;
            trajectoryChange();
        }*/
        if(keys[37]){
            players[myId].dx -= players[myId].speed;
            trajectoryChange();
        }
        if(keys[39]){
            players[myId].dx += players[myId].speed;
            trajectoryChange();
        }
    }
}

function physic() {

    for (i in boxes) {
        var box = boxes[i];
        box.y += box.gravity;
        if(box.ttl > 0) {
            box.ttl--;
        } else if (box.ttl == 0) {
            delete boxes[i];
        }
    }

    /*if(canJump > 0) {
        canJump--;
    }*/
    canJump = false;

    for (i in players) {
        var player = players[i];

        player.grounded = false;
        player.sliding_left = false;
        player.sliding_right = false;



        player.dy += player.gravity;
        player.y += player.dy;



        for (j in boxes) {
            colCheck(player, boxes[j]);
            cj = contact(player, boxes[j]);

            player.grounded |= (cj == 'b');
            player.sliding_left |= (cj == 'l');
            player.sliding_right |= (cj == 'r');
            /*if(player.sliding_left) {
                player.color1 = '#FF0000';
            } else {
                player.color1 = '#000000';
            }*/

            if(alive && player.id == myId) {
                if ((cj != '0' && cj != 't')) {
                    //canJump = true;
                    //canJump = wallJumpTolerance;
                    cj = contact(player, boxes[j]);
                    canJump |= (cj != '0' && cj != 't');
                }
            }
        }


        if(player.grounded) {
            player.dx *= friction;
        } else {
            player.dx *= airFriction;
        }

        //Cap vertical speed
        if(player.sliding_left || player.sliding_right) {
            if(player.dy > maxSlidingDy) {
                player.dy = maxSlidingDy;
            }
        } else {
            if(player.dy > maxDy) {
                player.dy = maxDy;
            } else if(player.dy < -maxDy) {
                player.dy = -maxDy;
            }
        }

        //Cap horizontal speed
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
        if(obj.type == 2 && obj.ttl < 0) {
            obj.color = '#FF0000';
            obj.ttl = 15;
        }
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                col = 't';
                //player.y = obj.y + obj.h;
                player.y += oY;
                player.dy = 1;
            } else {
                col = 'b';
                //player.y = obj.y - player.h;
                player.y -= oY;
                player.dy = 0;
            }
        } else {
            if (vX > 0) {
                col = 'l';
                //player.x += oX + 1;
                player.dx = 0;
                player.x += oX;
            } else {
                col = 'r';
                //player.x -= oX - 1;
                player.dx = 0;
                player.x -= oX;
            }
        }
    }
    return col;
}

function contact(player, obj) {
     // get the vectors to check against
     var vX = (player.x + (player.w / 2)) - (obj.x + (obj.w / 2)),
         vY = (player.y + (player.h / 2)) - (obj.y + (obj.h / 2)),
         // add the half widths and half heights of the objects
         hWidths = (player.w / 2) + (obj.w / 2) + 2,
         hHeights = (player.h / 2) + (obj.h / 2) + 2,
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
            player.x - (player.dx / 3) * 4 - 4,
            player.y - (player.dy / 3) * 4 - 4,
            player.w + 8,
            player.h + 8
        );
        ctx.fillStyle = player.color2;
        ctx.fillRect(player.x, player.y, player.w, player.h);
    }
}



document.body.addEventListener("keydown", function(e) {
    if((e.keyCode == 32 || e.keyCode == 38) && !keys[e.keyCode]
    && (players[myId].sliding_right || players[myId].sliding_left || players[myId].grounded)) {
        doJump = true;
    }
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

window.addEventListener("load", function() {
    update();
});