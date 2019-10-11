var eventTimes = 0;
var targetSpeed = 1;
var myPlayBackRate = 1;
var y = 0;
var message = '';
var printHold = 1;
var fonts = [ "Lato", "Helvetica Neue", "Helvetica", "Arial", "Sans-Serif",
              "OS Default Font", "American Typewriter",	"Andale Mono",	"Apple Chancery",
              "Arial Black",	"Brush Script", "Baskerville",	"Big Caslon",	"Comic Sans MS",
              "Copperplate", "Courier New",	"Gill Sans", "Futura", "Herculanum", "Impact"
            ]
var image = new Image;
ws = new WebSocket("wss://travis.durieux.me");
var timeNow = 0;
var mean = 0;
var total = 0;
var loops = 0;
var myVideo = document.getElementById("myVideo");
var panX = 0;
var panY = 0;
var m = 0;
var n = 0;
var drawIndex = 0;
var consoleMessage = false;
var playbackReduction = 4;
var printMessage = true;
var loop;
// I want to count number for commits revealed per second
if (typeof myVideo.loop == 'boolean') { // loop supported
  myVideo.loop = true;
} else { // loop property not supported
  myVideo.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
  }, false);
}
myVideo.play


// the  video be given a speed depending on the number of commits revealed
setInterval(function() {
  setPlayBackRate();
  y = eventTimes;
  eventTimes = 0;

  //addImage()

}, 2000);

// in the onmessage funtion we can increment the eventTime variable that will hold number of commits per seconds
ws.onmessage = function(event) {
    var obj = JSON.parse(event.data);

    message = obj.data.commit.message;
    eventTimes = eventTimes + 1;
    timeNow = event.timeStamp;

};

var chart = Highcharts.chart('container', {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
              // set up the updating of the chart each second
            var series = this.series[0];
            setInterval(function () {
                var x = (new Date()).getTime(); // current time

                series.addPoint([x, y], true, true);
            }, 2000);
            }
        }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Travis the piano playing dog'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'Video Speed',
            color: '#4B0082'
        },
        plotLines: [{
            value: 0,
            width: 2,
            color: '#FF69B4'
        }]

    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'Random data',
        data: (function () {
            // generate an array of random data
            var data = [],
                time = (new Date()).getTime(),
                i;

            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: Math.random()
                });
            }
            return data;
        }())
    }]
});


document.addEventListener('DOMContentLoaded', function(){
    var v = document.getElementById('myVideo');
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');

    var cw = 1400;
    var ch = 800;
    loop = document.getElementById("audioloop");


    canvas.width = cw;
    canvas.height = ch;
    //startAudioFilter()

    v.addEventListener('play', function(){
        draw(this,context,cw,ch);
    },false);

},false);

function draw(v,c,w,h) {

    loop.playbackRate = myPlayBackRate / (playbackReduction*2);
    myVideo.playbackRate = myPlayBackRate / playbackReduction;
    if(v.paused || v.ended) return false;
    var imgW = w + w*myPlayBackRate;
    var imgH = h + h*myPlayBackRate;
    //  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    var zoom = eventTimes*2;
    if (eventTimes < 20) {
      c.globalAlpha = myPlayBackRate/ 30;
        wdiv = Math.floor(Math.random() * 20)-10
        hdiv = Math.floor(Math.random() * 20)-10
        if (drawIndex % eventTimes*3  == 0) {
          c.globalAlpha = myPlayBackRate * 0.3;
          c.fill = randomColor();
          c.fillStyle = randomColor();
          c.fillRect(0, 0, imgW, imgW);
        } else {

          c.drawImage(v, 0+(eventTimes), 0+(eventTimes), w-(eventTimes), h-(eventTimes), 0, -200, w*2.4, h*2.4);
    }


  } else if (eventTimes < 30) {
      c.globalAlpha = myPlayBackRate * 0.3;
        // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        c.drawImage(v, 0+(eventTimes), 0+(eventTimes), w-(eventTimes), h-(eventTimes), 0, -200, w*2.4, h*2.4);
    } else if (eventTimes < 60) {
      //var thenumber = Math.floor(Math.random() *10);
        var thenumber = Math.floor(myPlayBackRate/30);
         c.globalAlpha = 0.9;
            if (m < thenumber) {
              if (n < thenumber) {
                c.drawImage(v, (w/thenumber)*n, (h/thenumber)*m, w/thenumber, h/thenumber , 0, -200, (w*2.4)/thenumber, (h*2.4)/thenumber);
                c.drawImage(v, 0+(eventTimes), 0+(eventTimes), w-(eventTimes), h-(eventTimes), 0, -200, w*2.4, h*2.4);

                n++;
              } else {
                m++;
                n = 0;
              }

            } else {
              m = 0;
            }
    } else if (eventTimes < 160) {
        c.globalAlpha = 0.1;
        var thenumber = Math.floor(eventTimes/80);
        for (var i=0; i < thenumber; i++) {
          for (var j=0; j < thenumber; j++) {
            c.drawImage(v, (w/thenumber)*j, (h/thenumber)*i, w/thenumber, h/thenumber);
          }
        }
    }
  if (printMessage) {
      var move = drawIndex % 200;
      c.globalAlpha = 0.9;
      c.fill = randomColor();
      c.fillStyle = randomColor();
      c.font = Math.floor(Math.random() * 80)+"px " + fonts[Math.floor(Math.random() * fonts.length)];
      c.fillText(message, Math.floor(Math.random() * 800), Math.floor(Math.random() * 100 + 400)+move);
      c.fillText(eventTimes, Math.floor(Math.random() * 400), Math.floor(Math.random() * 100 + 400)+move);
      if(consoleMessage)
         c.fillText("Eventtime is: " +eventTimes, 40, 40)
      c.strokeStyle = randomColor();
      c.lineWidth = Math.floor(Math.random() * 6);
      c.beginPath();
      c.moveTo(0,move+400);
      c.lineTo(2000,move+400);
      c.stroke();
    }

    drawIndex++;
    var timeout = 40 - myVideo.playbackRate
    setTimeout(draw,timeout,v,c,w,h);
}
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'mwe4HPOiUms',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// the video playback rate should step twards message speed
// if the
function setPlayBackRate() {
  if (myPlayBackRate < 0.1) {
    myPlayBackRate = 0.2;
  } else if (myPlayBackRate > 15) {
    myPlayBackRate = 14;
  }
  if (myPlayBackRate > eventTimes) {
    myPlayBackRate = myPlayBackRate - 0.2;
  } else {
    myPlayBackRate = myPlayBackRate + 0.1;
  }
  if(consoleMessage) {
      console.log("the playback rate is:", myPlayBackRate);
      console.log("eventtime is: ", eventTimes);
  }
  myPlayBackRate = setAverageMean(myPlayBackRate);
}


function setAverageMean(myPlayBackRate) {
  loops++;
  total = total + myPlayBackRate;
  mean = total / loops;
  if(consoleMessage)
    console.log("mean is: ", mean);
  if(loops < 100) {
    loops = 0;
    total = 0;
  }
  return mean;
}

function setVideoTime() {
  targetSpeed = (eventTimes / mean) * eventTimes;
  // x = (30 / 20) = 1.2 *
  if(consoleMessage)
      console.log(eventTimes);
  setMean(eventTimes);
  y = eventTimes;
  eventTimes = eventTimes / 3;
  if(consoleMessage)
      console.log("targetspeed is: ", targetSpeed);
}

function addImage() {
  var svg = chart.getSVG({
          exporting: {
              sourceWidth: Highcharts.chart.chartWidth,
              sourceHeight: Highcharts.chart.chartHeight
          }
      });
  image.src = 'data:image/svg+xml;base64,' + window.btoa(svg);
}
function startAudioFilter() {
  var acontext = new AudioContext(),
  audioSource = acontext.createMediaElementSource(document.getElementById("myVideo")),
  filter = acontext.createBiquadFilter();
  audioSource.connect(filter);
  filter.connect(context.destination);
  // Configure filter
  filter.type = "lowshelf";
  filter.frequency.value = 1000;
  filter.gain.value = 25;
}
function randomColor() {
  var r = 255*Math.random()|0,
      g = 255*Math.random()|0,
      b = 255*Math.random()|0
 return 'rgb(' + r + ',' + g + ',' + b + ')';
}
