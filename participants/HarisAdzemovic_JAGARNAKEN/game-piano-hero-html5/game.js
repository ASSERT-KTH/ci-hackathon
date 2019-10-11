var tileHolder = [];
var config = {
    playing: false,
    isGameOver: false,
    cols: 7,
    rows: 8,
    width: window.innerWidth,
    height: window.innerHeight,
    speed: 20,
    tile: {
        border: 0,
        color: {
            limegreen: '#00FF00',
            black : '#000',
            grey: '#808080',
            white: "#FFFFFF",
            red: "#FF0000",
        },
    },
    gameInterval: null,
    score: 0,
    maxScore: 0,
    accent: "#18f3ad",
    font: "bold 30px monospace",
    fontNormal: "bold 20px monospace",
    intervalTime: 40,
    incrementSpeedAfterTile: 10
};

function tileObject() {
    this.width = config.width / config.cols;
    this.height = config.height / config.rows;
    this.x = 0;
    this.y = 0;
    this.bgColor = config.tile.color.black;
    this.borderColor = config.tile.color.black;
    this.border = config.tile.border;
    this.clickable = false;
    this.isClicked = false;
    this.row = 0;
    this.col = 0;
}

function _(id) {
    return document.getElementById(id);
}

function init() {
    tileHolder = [];

    // estica canvas
    var canvas = _('gameCanvas');
    canvas.width = config.width;
    canvas.height = config.height;
    canvas.style.width = config.width + 'px';
    canvas.style.height = config.height + 'px';

    var halfRow = Math.round(config.rows / 2);
    var startTile = null;
    for (var i = 0; i < config.rows + 2; i++) {
        var selectedRandomTile = false;
        for (var j = 0; j < (config.cols); j++) {
            var tile = new tileObject();
            tile.x = tile.width * j;
            tile.y = config.height - tile.height * i;
            tile.row = i;
            tile.col = j;
            if (!selectedRandomTile) {

                if (
                    (Math.ceil(Math.random() * 5) == 2)
                        ||
                        j == config.cols - 1
                        ) {

                    selectedRandomTile = true;
                    /*
                     * Make starting some tile unclickable for game
                     */
                    if (i >= halfRow) {

                        if (startTile == null) {
                            startTile = tile;
                        }

                        makeTileClickable(tile);
                    }

                }
            }

            tileHolder.push(tile);
        }
    }
    draw();
    drawStartTile(startTile);
}

function drawStartTile(tile) {
    var c = _("gameCanvas").getContext('2d');
    c.font = config.fontNormal;
    c.fillStyle = config.tile.color.limegreen;
    c.textAlign = "center";
    c.textBaseline = "middle";
    var x = tile.x + tile.width / 2;
    var y = tile.y + tile.height / 2;
    c.fillText("Start", x, y);
}


function startGame() {
    config.playing = true;
    config.gameInterval = setInterval(draw, 50);
}

function draw() {
    
    if (config.playing) {
        moveToNextFrame();
    }
    var c = _("gameCanvas").getContext('2d');
    c.clearRect(0, 0, config.width, config.height);
    for (var i = 0; i < tileHolder.length; i++) {
        var tempTile = tileHolder[i];
        drawTile(tempTile);
    }
    drawText(c);
    controleSpeed();

}

function drawTile(tempTile) {
    var c = _("gameCanvas").getContext('2d');
    c.fillStyle = tempTile.borderColor;
    c.fillRect(tempTile.x, tempTile.y, tempTile.width, tempTile.height);
    c.fillStyle = tempTile.bgColor;
    c.fillRect(tempTile.x + tempTile.border, tempTile.y + tempTile.border,
            tempTile.width - tempTile.border, tempTile.height - tempTile.border);
    c.fill();
}

function drawText(c) {
    c.font = config.font;
    c.fillStyle = config.accent;
    c.textAlign = "center";
    c.fillText(config.score, config.width / 2, 30);
}

function controleSpeed() {
    var num = config.incrementSpeedAfterTile;
    if (config.score % num == num - 1) {
        var speed = config.intervalTime - 5 * Math.round(config.score / num);
        if (speed < 5) {
            speed = 5;
        } else {
            clearInterval(config.gameInterval);
            config.gameInterval = setInterval(draw, speed);
        }
        console.log("Speed ->" + speed);
    }
}

function makeTileClickable(tile) {
    tile.clickable = true;
    tile.isClicked = false;
    tile.bgColor = config.tile.color.limegreen;
}

function moveToNextFrame() {
    var len = tileHolder.length;
    var maxPosition = getMaxRowPosition();
    var tempTileHolder = [];
    for (var i = 0; i < len; i++) {
        var tempTile = tileHolder[i];

        //Check if clickable tile has reached to end
        //i.e. Game Over
        if (tempTile.clickable && !tempTile.isClicked && tempTile.bgColor != config.tile.color.white) {
            if (tempTile.y + tempTile.height + config.speed >= config.height) {
                // Tile reaches end
                tempTile.bgColor = config.tile.color.white;
                tock();
            }
        }

        if (tempTile.y > config.height) {
            //Remove Tile and add new tile or reset existing tile
            tempTile.y = maxPosition - tempTile.height;
            resetTileExceptXYPosition(tempTile);
            tempTileHolder.push(tempTile);
        }
        tempTile.y += config.speed;
    }

    if (tempTileHolder.length > 0) {
        var randomeNumber = Math.ceil(Math.random() * config.cols - 1);
        console.log("Randome Number ->" + randomeNumber);
        makeTileClickable(tempTileHolder[randomeNumber]);
    }

}
function getMaxRowPosition() {
    var len = tileHolder.length;
    var maxTile = null;
    for (var i = 0; i < len; i += config.cols) {
        var tempTile = tileHolder[i];
        if (maxTile == null) {
            maxTile = tempTile;
        } else if (maxTile.y > tempTile.y) {
            maxTile = tempTile;
        }
    }
    return maxTile.y;
}

function stopGame() {
    clearInterval(config.gameInterval);
}

function gameMouseClick(e) {

    var x = e.clientX - _("gameCanvas").offsetLeft + window.scrollX;
    var y = e.clientY - _("gameCanvas").offsetTop + window.scrollY;
    console.log('x',x,'y',y);

    var leftButton = x < window.innerWidth/2 && y > window.innerHeight/2;


    if (config.isGameOver) {
        init();

    if(leftButton)
        showMusics();

        config.isGameOver = false;
        return;
    } else {

        if (!config.playing) {

            startGame();
        }
    }

    
    var clickedTile = getTileInPosition({x: x, y: y});

    if (clickedTile != null) {
        if (clickedTile.clickable) {
            if (!clickedTile.isClicked) {
                console.log("Nice!");
                clickedTile.isClicked = true;
                clickedTile.bgColor = config.tile.color.grey;
                config.score++;
                tock(); //Play note(?)

            } else {
                clickedTile.bgColor = config.tile.color.red;
//                            clickedTile.y += config.speed;
                drawTile(clickedTile);
                console.log("Wrong Tile. Game Over");
                gameOver();
            }
        } else {
            clickedTile.bgColor = config.tile.color.red;
//                        clickedTile.y += config.speed;
            drawTile(clickedTile);
            console.log("Wrong Tile. Game OVER")
            gameOver();
        }
    } else {
        console.log("Tile Not Found");
    }
}

function getTileInPosition(coords) {
    var x = coords.x;
    var y = coords.y;
    var len = tileHolder.length;

    for (var i = 0; i < len; i++) {
        var tempTile = tileHolder[i];
        if (x > tempTile.x && x < tempTile.x + tempTile.width) {
            if (y > tempTile.y && y < tempTile.y + tempTile.height) {
                return tempTile;
            }
        }
    }
    return null;

}

function resetTileExceptXYPosition(tile) {
    var y = tile.y;
    var x = tile.x;
    var tempTile = new tileObject();
    for (var k in tempTile) {
        tile[k] = tempTile[k];
    }
    tile.y = y;
    tile.x = x;
}

function gameOver() {
    config.isGameOver = true;
    config.playing = false;
    config.score = 0;
    clearInterval(config.gameInterval);
    var c = _("gameCanvas").getContext('2d');

    c.font = config.font;
    c.fillStyle = config.accent;
    c.textAlign = "center";
    c.fillText("Game Over", config.width / 2, 150);
    var imgReplay = _("replay");
    c.drawImage(imgReplay, config.width / 2 , config.height - 50 - 30, 60, 60);

    var imgMusic = _("music");
    c.drawImage(imgMusic, config.width / 2 - 70, config.height - 50 - 30, 60, 60);

}

init();

function showMusics(){

    var menuContainer = _('menuContainer');
    menuContainer.classList.remove('invisible');
    menuContainer.classList.toggle('visible');

    var gameContainer = _('gameContainer');
    gameContainer.classList.remove('visible');
    gameContainer.classList.toggle('invisible');


}

function selectSong(index){

    var menuContainer = _('menuContainer');
    menuContainer.classList.remove('visible');
    menuContainer.classList.toggle('invisible');

    var gameContainer = _('gameContainer');
    gameContainer.classList.remove('invisible');
    gameContainer.classList.toggle('visible');

    playSong(index);
}
