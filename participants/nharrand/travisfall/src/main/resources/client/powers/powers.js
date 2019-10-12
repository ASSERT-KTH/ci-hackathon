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
    }
}

//----------------- Killing ray --------------------------- //

function rayDraw(eph, ctx, width, players) {
    let player = players.get(eph.playerId);

    rayDrawLayer(ctx, player, eph.curSize, eph, eph.color, width);
    if(eph.curSize > 6) {
        rayDrawLayer(ctx, player, eph.curSize-5, eph, '#FFFFFF', width);
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

        ctx.fillRect(x, y - layerSize, eph.range, 2 * layerSize);
        //ctx.fillRect(x, y - layerSize, width-x, 2*layerSize);
        ctx.beginPath();
        ctx.arc(x, y, layerSize+1, 0, 2 * Math.PI);
        ctx.fill();
    } else {
        let x = player.x - 0.5 * player.w;
        let y = player.y + 0.5 * player.h;

        ctx.fillRect(x - eph.range, y - layerSize, eph.range, 2 * layerSize);
        //ctx.fillRect(0, y - layerSize, x, 2*layerSize);
        ctx.beginPath();
        ctx.arc(x, y, layerSize+1, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function rayContact(eph, other, players) {
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
}

function rayApply(player) {
    iamDead();
}

function rayEnd(player) {

}

function rayCreate(player, socket, timestamp) {
    socket.send(JSON.stringify({
      t: 6,
      type: 0,
      playerId: player.id,
      x: player.x,
      y: player.y,
      range: 400,
      maxSize: 12,
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
        maxSize: 12,
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

//----------------- Dash --------------------------- //

function dashDraw(eph, ctx, width, players) {
    let player = players.get(eph.playerId);

    //if(eph.right)
}

function dashContact(eph, other, players) {

}

function dashApply(player) {
    iamDead();
}

function dashEnd(player) {

}

function dashCreate(player, socket, timestamp) {

}
