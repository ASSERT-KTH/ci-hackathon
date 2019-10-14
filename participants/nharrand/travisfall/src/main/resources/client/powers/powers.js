//----------------- Parse incoming ephemerals --------------------------- //

function createEphemeralFromMsg(event, ephemerals, players) {
    if(event.type == 0 && players.has(event.playerId)) {
        ephemerals.push({
            type: event.type,
            playerId: event.playerId,
            x: event.x,
            y: event.y,
            range: event.range,
            maxSize: event.maxSize,
            curSize: event.curSize,
            step: event.step,
            right: event.right,
            up: event.up,
            color: event.color,
            toRemove: event.toRemove,
            contact: rayContact,
            draw: rayDraw,
            apply: rayApply,
            end: rayEnd
        });
    } else if(event.type == 1 && players.has(event.playerId)) {
        ephemerals.push({
            type: event.type,
            playerId: event.playerId,
            x: event.x,
            y: event.y,
            range: event.range,
            maxSize: event.maxSize,
            curSize: event.curSize,
            step: event.step,
            right: event.right,
            up: event.up,
            color: event.color,
            toRemove: event.toRemove,
            contact: dashContact,
            draw: dashDraw,
            apply: dashApply,
            end: dashEnd
        });
    } else if(event.type == 2 && players.has(event.playerId)) {
             ephemerals.push({
                 type: event.type,
                 playerId: event.playerId,
                 x: event.x,
                 y: event.y,
                 range: event.range,
                 maxSize: event.maxSize,
                 curSize: event.curSize,
                 step: event.step,
                 right: event.right,
                 up: event.up,
                 color: event.color,
                 toRemove: event.toRemove,
                contact: stoprayContact,
                draw: stoprayDraw,
                apply: stoprayApply,
                end: stoprayEnd
             });
         }
}

//----------------- Killing ray --------------------------- //

function rayDraw(eph, ctx, width, players) {
    if(players.has(eph.playerId)) {
        let player = players.get(eph.playerId);
        rayDrawLayer(ctx, player, eph.curSize, eph, eph.color, width);
        if(eph.curSize > 3) {
            rayDrawLayer(ctx, player, eph.curSize - 3, eph, '#FFFFFF', width);
        }
    }

    if(eph.up) {
        if(eph.curSize < eph.maxSize) {
            eph.curSize += eph.step;
        } else {
            eph.up = false
        }
    } else {
        if(eph.curSize > 0) {
            eph.curSize -= 1;
        } else {
            eph.toRemove = true;
        }
    }
}

function rayDrawLayer(ctx, player, layerSize, eph, color, width) {
    ctx.fillStyle = color;
    if(eph.right) {
        let x = player.x + 1.5 * player.w;
        let y = player.y + 0.5 * player.h;

        ctx.beginPath();
        ctx.arc(x + eph.range, y, layerSize, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillRect(x, y - layerSize, eph.range, 2 * layerSize);

        ctx.beginPath();
        ctx.arc(x, y, layerSize+1, 0, 2 * Math.PI);
        ctx.fill();
    } else {
        let x = player.x - 0.5 * player.w;
        let y = player.y + 0.5 * player.h;

        ctx.beginPath();
        ctx.arc(x - eph.range, y, layerSize, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillRect(x - eph.range, y - layerSize, eph.range, 2 * layerSize);

        ctx.beginPath();
        ctx.arc(x, y, layerSize+1, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function rayContact(eph, other, players) {
    if(players.has(eph.playerId)) {
        let player = players.get(eph.playerId);
        let x = player.x;
        let y0 = player.y + 0.5 * player.h - eph.curSize;
        let y1 = player.y + 0.5 * player.h + eph.curSize;

        let xCol = (((other.x + other.w) > (x - eph.range) && other.x < x && !eph.right)
                    || (other.x < (x + eph.range) && other.x > x && eph.right));
       let yCol = ((other.y > y0 && other.y < y1)
                    || ((other.y + other.h) > y0 && (other.y + other.h) < y1)
                    || (other.y < y0 && (other.y + other.h) > y1));

        return xCol && yCol;
    } else {
        return false;
    }
}

function rayApply(eph, player) {
    if(!isInvu) {
        iamDead();
    }
}

function rayEnd(eph, players) {

}

function rayCreate(player, socket, timestamp) {
    socket.send(JSON.stringify({
      t: 6,
      type: 0,
      playerId: player.id,
      x: player.x,
      y: player.y,
      range: 400,
      maxSize: 6,
      curSize: 0,
      step: 2,
      right: right,
      up: true,
      color: '#0000FF',
      toRemove: false
    }));
    return {
        type: 0,
        playerId: player.id,
        x: player.x,
        y: player.y,
        range: 400,
        maxSize: 6,
        curSize: 0,
        step: 2,
        right: right,
        up: true,
        color: '#0000FF',
        toRemove: false,
        contact: rayContact,
        draw: rayDraw,
        apply: rayApply,
        end: rayEnd
   };
}

//----------------- Stop ray --------------------------- //

function stoprayDraw(eph, ctx, width, players) {
    if(players.has(eph.playerId)) {
        let player = players.get(eph.playerId);

        rayDrawLayer(ctx, player, eph.curSize, eph, eph.color, width);
        if(eph.curSize > 2) {
            rayDrawLayer(ctx, player, eph.curSize-2, eph, '#FFFFFF', width);
        }
    }

    if(eph.up) {
        if(eph.curSize < eph.maxSize) {
            eph.curSize += eph.step;
        } else {
            eph.up = false
        }
    } else {
        if(eph.curSize > 0) {
            eph.curSize -= 1;
        } else {
            eph.toRemove = true;
        }
    }
}

function stoprayContact(eph, other, players) {
    if(players.has(eph.playerId)) {
        let player = players.get(eph.playerId);
        let x = player.x;
        let y0 = player.y + 0.5 * player.h - eph.curSize;
        let y1 = player.y + 0.5 * player.h + eph.curSize;

        let xCol = (((other.x + other.w) > (x - eph.range) && other.x < x && !eph.right)
                || (other.x < (x + eph.range) && other.x > x && eph.right));
        let yCol = ((other.y > y0 && other.y < y1)
                || ((other.y + other.h) > y0 && (other.y + other.h) < y1)
                || (other.y < y0 && (other.y + other.h) > y1));

        return xCol && yCol;
   } else {
       return false;
   }
}

function stoprayApply(eph, player) {
    player.dx = 0;
    if(player.dy < 0) {
        player.dy = 0;
    }
    trajectoryChange();
}

function stoprayEnd(eph, players) {

}

function stoprayCreate(player, socket, timestamp) {
    socket.send(JSON.stringify({
      t: 6,
      type: 2,
      playerId: player.id,
      x: player.x,
      y: player.y,
      range: 1000,
      maxSize: 4,
      curSize: 0,
      step: 2,
      right: right,
      up: true,
      color: '#00FF00',
      toRemove: false
    }));
    return {
        type: 2,
        playerId: player.id,
        x: player.x,
        y: player.y,
        range: 1000,
        maxSize: 4,
        curSize: 0,
        step: 2,
        right: right,
        up: true,
        color: '#00FF00',
        toRemove: false,
        contact: stoprayContact,
        draw: stoprayDraw,
        apply: stoprayApply,
        end: stoprayEnd
   };
}

//----------------- Dash --------------------------- //

function dashDraw(eph, ctx, width, players) {
    if(eph.playerId == myId) {
        isInvu = true;
    }
    if(players.has(eph.playerId)) {
        let player = players.get(eph.playerId);
        let overf = 20;
        if(eph.curSize == 0) {
            eph.x = player.x;
            eph.y = player.y;
            player.maxSpeed = 20;
        }

        if(eph.curSize < eph.maxSize) {

            ctx.fillStyle = eph.color;
            if(eph.right) {
                player.dx = player.maxSpeed;
                player.dy = -player.gravity;

                ctx.beginPath();
                ctx.arc(player.x + (player.w * 0.5), player.y + (0.5 * player.h), 0.5 * player.w + overf, 0, 2 * Math.PI);
                ctx.fill();

                //ctx.fillRect(eph.x + (player.w * 0.5), eph.y - overf, player.x - eph.x, player.h + 2 * overf);
                ctx.beginPath();
                ctx.moveTo(player.x + (player.w * 0.5), player.y - overf);
                ctx.lineTo(player.x + (player.w * 0.5), player.y + player.h + overf);
                ctx.lineTo(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h) + 3);
                ctx.lineTo(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h) - 3);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                //ctx.arc(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h), 0.5 * player.w + overf, 0, 2 * Math.PI);
                ctx.arc(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h), 3, 0, 2 * Math.PI);
                ctx.fill();
            } else {
                player.dx = -player.maxSpeed;
                player.dy = -player.gravity;

                ctx.beginPath();
                ctx.arc(player.x + (player.w * 0.5), player.y + (0.5 * player.h), 0.5 * player.w + overf, 0, 2 * Math.PI);
                ctx.fill();

                //ctx.fillRect(eph.x + (player.w * 0.5), player.y - overf, player.x - eph.x, player.h + 2 * overf);
                ctx.beginPath();
                ctx.moveTo(player.x + (player.w * 0.5), player.y - overf);
                ctx.lineTo(player.x + (player.w * 0.5), player.y + player.h + overf);
                ctx.lineTo(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h) + 3);
                ctx.lineTo(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h) - 3);
                ctx.closePath();
                ctx.fill();

                ctx.beginPath();
                //ctx.arc(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h), 0.5 * player.w + overf, 0, 2 * Math.PI);
                ctx.arc(eph.x + (player.w * 0.5), eph.y + (0.5 * player.h), 3, 0, 2 * Math.PI);
                ctx.fill();
            }
            eph.curSize += eph.step;
        } else {
            eph.toRemove = true;
        }
    } else {
        eph.toRemove = true;
    }
}

function dashContact(eph, other, players) {
    if(players.has(eph.playerId) && other.id != eph.playerId) {
        let player = players.get(eph.playerId);
        let cx = player.x + player.w / 2;
        let cy = player.y + player.h / 2;
        let r = player.w / 2 + player.maxSpeed;

        let colTL = ((other.x - cx) * (other.x - cx) + (other.y - cy) * (other.y - cy)) < (r*r);
        let colTR = ((other.x + other.w - cx) * (other.x + other.w - cx) + (other.y - cy) * (other.y - cy)) < (r*r);
        let colBL = ((other.x - cx) * (other.x - cx) + (other.y + other.h - cy) * (other.y + other.h - cy)) < (r*r);
        let colBR = ((other.x + other.w - cx) * (other.x + other.w - cx) + (other.y + other.h - cy) * (other.y + other.h - cy)) < (r*r);
        return colTL && colTR && colBL && colBR;
    } else {
        return false;
    }
}

function dashApply(eph, player) {
    iamDead();
}

function dashEnd(eph, players) {
    if(eph.playerId == myId) {
        isInvu = false;
    }
    if(players.has(eph.playerId)) {
        let player = players.get(eph.playerId);
        player.maxSpeed = 8;
        if(eph.right) {
            //player.dx = 0;
        } else {
            //player.dx = 0;
        }
    }
}

function dashCreate(player, socket, timestamp) {
    socket.send(JSON.stringify({
      t: 6,
      type: 1,
      playerId: player.id,
      x: player.x,
      y: player.y,
      range: 0,
      maxSize: 12,
      curSize: 0,
      step: 1,
      right: right,
      up: true,
      color: '#42e6f5',
      toRemove: false
    }));
    return {
        t: 6,
        type: 1,
        playerId: player.id,
        x: player.x,
        y: player.y,
        range: 0,
        maxSize: 12,
        curSize: 0,
        step: 1,
        right: right,
        up: true,
        color: '#42e6f5',
        toRemove: false,
        contact: dashContact,
        draw: dashDraw,
        apply: dashApply,
        end: dashEnd
   };
}

//----------------- TeleportTop --------------------------- //

function teleportTopDraw(eph, ctx, width, players) {

}

function teleportTopContact(eph, other, players) {
    return false;
}

function teleportTopApply(eph, player) {

}

function teleportTopEnd(eph, players) {

}

function teleportTopCreate(player, socket, timestamp) {
    socket.send(JSON.stringify({
      t: 6,
      type: 3,
      playerId: player.id,
      x: player.x,
      y: player.y,
      range: 0,
      maxSize: 12,
      curSize: 0,
      step: 1,
      right: right,
      up: true,
      color: '#42e6f5',
      toRemove: false
    }));
    return {
        t: 6,
        type: 3,
        playerId: player.id,
        x: player.x,
        y: player.y,
        range: 0,
        maxSize: 12,
        curSize: 0,
        step: 1,
        right: right,
        up: true,
        color: '#42e6f5',
        toRemove: false,
        contact: dashContact,
        draw: dashDraw,
        apply: dashApply,
        end: dashEnd
   };
}
