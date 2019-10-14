// VisualTrav - create visual Travis object
var visualTrav = new Object();
visualTrav.eventTimes = 0;
visualTrav.lasteventTimes = 0;
visualTrav.targetSpeed = 1;
visualTrav.myPlayBackRate = 1;
visualTrav.timesy = 50;
visualTrav.message = '';
visualTrav.fonts = [ "Lato", "Helvetica Neue", "Helvetica", "Arial", "Sans-Serif",
              "OS Default Font", "American Typewriter",	"Andale Mono",	"Apple Chancery",
              "Arial Black",	"Brush Script", "Baskerville",	"Big Caslon",	"Comic Sans MS",
              "Copperplate", "Courier New",	"Gill Sans", "Futura", "Herculanum", "Impact",
              "Dingbat", "Zapf Dingbats", "Webdings", "Abadi MT Condensed Light", "Adobe Caslon Pro",
              "Adobe Garamond Pro", "Al Bayan", "American Typewriter", "Andale Mono",
              "Apple Braille", "Apple Chancery", "Apple LiGothic", "Apple LiSung", "Apple Symbols",
              "AppleGothic", "AppleMyungjo", "Arial", "Arial Black", "Arial Hebrew", "Arial Narrow",
              "Arial Rounded MT Bold", "Arial Unicode MS", "Arno Pro", "Ayuthaya", "Baghdad",
              "Baskerville", "Baskerville Old Face", "Batang", "Bauhaus 93", "Bell Gothic Std",
              "Bell MT", "Bernard MT Condensed", "BiauKai", "Bickham Script Pro", "Big Caslon", "Birch Std",
              "Blackoak Std", "Book Antiqua", "Bookman Old Style", "Bookshelf Symbol 7", "Braggadocio",
              "Britannic Bold", "Brush Script MT", "Brush Script Std", "Calibri", "Calisto MT", "Cambria",
              "Candara", "Century", "Century Gothic", "Century Schoolbook", "Chalkboard", "Chalkduster",
              "Chaparral Pro", "Charcoal CY", "Charlemagne Std", "Cochin", "Colonna MT", "Comic Sans MS",
              "Consolas", "Constantia", "Cooper Black", "Cooper Std", "Copperplate", "Copperplate Gothic Bold",
              "Copperplate Gothic Light", "Corbel", "Corsiva Hebrew", "Courier", "Courier New", "Curlz MT",
              "DecoType Naskh", "Desdemona", "Devanagari MT", "Didot", "Eccentric Std", "Edwardian Script ITC",
              "Engravers MT", "Euphemia UCAS", "Eurostile", "Footlight MT Light", "Franklin Gothic Book",
              "Franklin Gothic Medium", "Futura", "Garamond", "Garamond Premier Pro", "GB18030 Bitmap",
              "Geeza Pro", "Geneva", "Geneva CY", "Georgia", "Giddyup Std", "Gill Sans", "Gill Sans MT",
              "Gill Sans Ultra Bold", "Gloucester MT Extra Condensed", "Goudy Old Style", "Gujarati MT",
              "Gulim", "GungSeo", "Gurmukhi MT", "Haettenschweiler", "Harrington", "HeadLineA", "Hei",
              "Heiti SC", "Heiti TC", "Helvetica", "Helvetica CY", "Helvetica Neue", "Herculanum",
              "Hiragino Kaku Gothic Pro", "Hiragino Kaku Gothic ProN", "Hiragino Kaku Gothic Std",
              "Hiragino Kaku Gothic StdN", "Hiragino Maru Gothic Pro", "Hiragino Maru Gothic ProN",
              "Hiragino Mincho Pro", "Hiragino Mincho ProN", "Hiragino Sans GB", "Hobo Std", "Hoefler Text",
              "Impact", "Imprint MT Shadow", "InaiMathi", "Kai", "Kailasa", "Kino MT", "Kokonor",
              "Kozuka Gothic Pro", "Kozuka Mincho Pro", "Krungthep", "KufiStandardGK", "Letter Gothic Std",
              "LiHei Pro", "LiSong Pro", "Lithos Pro", "Lucida Blackletter", "Lucida Bright", "Lucida Calligraphy",
              "Lucida Console", "Lucida Fax", "Lucida Grande", "Lucida Handwriting", "Lucida Sans",
              "Lucida Sans Typewriter", "Lucida Sans Unicode", "Marker Felt", "Marlett",
              "Matura MT Script Capitals", "Meiryo", "Menlo", "Mesquite Std", "Microsoft Sans Serif",
              "Minion Pro", "Mistral", "Modern No. 20", "Monaco", "Monotype Corsiva", "Monotype Sorts",
              "MS Gothic", "MS Mincho", "MS PGothic", "MS PMincho", "MS Reference Sans Serif",
              "MS Reference Specialty", "Mshtakan", "MT Extra", "Myriad Pro", "Nadeem", "New Peninim MT",
              "News Gothic MT", "Nueva Std", "OCR A Std", "Onyx", "Optima", "Orator Std", "Osaka", "Papyrus",
              "PCMyungjo", "Perpetua", "Perpetua Titling MT", "PilGi", "Plantagenet Cherokee", "Playbill",
              "PMingLiU", "Poplar Std", "Prestige Elite Std", "Raanana", "Rockwell", "Rockwell Extra Bold",
              "Rosewood Std", "Sathu", "Silom", "SimSun", "Skia", "Stencil", "Stencil Std", "STFangsong",
              "STHeiti", "STKaiti", "STSong", "Symbol", "Tahoma", "Tekton Pro", "Thonburi", "Times",
              "Times New Roman", "Trajan Pro", "Trebuchet MS", "Tw Cen MT", "Verdana", "Webdings",
              "Wide Latin", "Wingdings", "Wingdings 2", "Wingdings 3", "Zapf Dingbats", "Zapfino"
            ];
visualTrav.composites = ["luminosity", "color", "saturation", "hue", "exclusion", "soft-light",
                  "difference", "hard-ligh", "color-burn", "color-dodge", "lighten", "darken",
                  "overlay", "screen", "multiply", "normal"
                ];
visualTrav.timeNow = 0;
visualTrav.mean = 0;
visualTrav.total = 0;
visualTrav.iterations = 0;
visualTrav.loops = 0;
visualTrav.myVideo = document.getElementById("myVideo");
visualTrav.drawIndex = 0;
visualTrav.consoleMessage = false;
visualTrav.beatloop;
visualTrav.policeloop;
visualTrav.printMessage = false;
visualTrav.flashColors = false;
visualTrav.compositesDist = false;
visualTrav.videoGrid = false;
visualTrav.cutImage = false;
visualTrav.speedOnly = true;
visualTrav.flashColorsLimit = 2;
visualTrav.compositesDistLimit = 10;
visualTrav.videoGridLimit = 15;
visualTrav.cutImageLimit = 20;
visualTrav.m = 0;
visualTrav.n = 0;
visualTrav.simpelPlaybackRate = true;
visualTrav.block1 = 20;  // Only speed
visualTrav.block2 = 30;  // add beat
visualTrav.block3 = 40; // add flash color
visualTrav.block3 = 50; // add video distort and police
visualTrav.block4 = 60; // add image grid
visualTrav.block5 = 120; // random cut
visualTrav.block6 = 120; // reset
visualTrav.HighImg = new Image();
visualTrav.playbackReduction = 4;
visualTrav.failed = 0;
visualTrav.passed = 0;
visualTrav.showPassedFail = false;

var image = new Image;
ws = new WebSocket("wss://travis.durieux.me");

// I want to count number for commits revealed per second
if (typeof visualTrav.myVideo.loop == 'boolean') { // loop supported
  visualTrav.myVideo.loop = true;
} else { // loop property not supported
  visualTrav.myVideo.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
  }, false);
}
visualTrav.myVideo.play


// the  video be given a speed depending on the number of commits revealed
setInterval(function() {
  if (visualTrav.eventTimes > 2) {
    visualTrav.timesy = visualTrav.eventTimes;
    visualTrav.iterations++
    lasteventTimes = visualTrav.eventTimes;
    setPlayBackRate();
    decideWhatToPlay();
    visualTrav.eventTimes = 0;
    console.log(visualTrav.failed, visualTrav.passed);
    visualTrav.failed = 0;
    visualTrav.passed = 0;
  }
  if(visualTrav.consoleMessage)
    console.log("interval")
}, 1000);

// in the onmessage funtion we can increment the eventTime variable that will hold number of commits per seconds
ws.onmessage = function(event) {
    var obj = JSON.parse(event.data);
    // console.log(obj.data.state);
    if (obj.data.state == 'failed' || obj.data.state == 'errored') {
      visualTrav.failed++;
    }
    if (obj.data.state == 'passed') {
      visualTrav.passed++;
    }
    visualTrav.message = obj.data.commit.message;
    visualTrav.eventTimes = visualTrav.eventTimes + 1;
    visualTrav.total = visualTrav.total + 1
    visualTrav.timeNow = event.timeStamp;
    if(visualTrav.eventTimes > 200) {
      visualTrav.eventTimes = 0;
    }
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
                console.log(series);
            setInterval(function () {
              var x = (new Date()).getTime(); // current time


                  series.addPoint([x, visualTrav.timesy], true, true);
            }, 1000);
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

    visualTrav.beatloop = document.getElementById("audioloop");
    visualTrav.policeloop = document.getElementById("ploop");
    canvas.width = cw;
    canvas.height = ch;
    v.addEventListener('play', function(){
        draw(this,context,cw,ch);
    },false);
},false);

function draw(v,c,w,h) {
    initSetData();


    if(v.paused || v.ended) return false;

    if (!visualTrav.speedOnly) {

      if (visualTrav.flashColorsLimit) {
        c.globalAlpha = 0.2;
        wdiv = Math.floor(Math.random() * visualTrav.eventTimes)-visualTrav.eventTimes/2;
        hdiv = Math.floor(Math.random() * visualTrav.eventTimes)-visualTrav.eventTimes/2;
        c.drawImage(v, 0, 0, w, h, 10-wdiv, -200-hdiv, w*2.4, h*2.4);
        visualTrav.beatloop.volume = visualTrav.beatloop.volume + 0.01;
      }

      if (visualTrav.compositesDistLimit) {
        c.globalAlpha = visualTrav.myPlayBackRate * 0.1;
        visualTrav.beatloop.volume = 0.5;
        visualTrav.policeloop.volume = 0.4;
        if (visualTrav.drawIndex % 2 == 0) {
          var videoStyle = Math.floor(Math.random() * visualTrav.composites.length);
          c.globalCompositeOperation = visualTrav.composites[videoStyle];
          c.drawImage(v, 0, 0, w, h, 0, -200, w*2.4, h*2.4);
          var videoStyle = Math.floor(Math.random() * visualTrav.composites.length);
          c.globalCompositeOperation = visualTrav.composites[videoStyle];
          c.drawImage(v, 0, 0, w, h, 0, -200, w*2.4, h*2.4);
          var videoStyle = Math.floor(Math.random() * visualTrav.composites.length);
          c.globalCompositeOperation = visualTrav.composites[videoStyle];
          c.drawImage(v, 0, 0, w, h, 0, -200, w*2.4, h*2.4);
          var videoStyle = Math.floor(Math.random() * visualTrav.composites.length);
          c.globalCompositeOperation = visualTrav.composites[videoStyle];
          c.drawImage(v, 0, 0, w, h, 0, -200, w*2.4, h*2.4);
        }


      }

      if (visualTrav.videoGrid) {
        visualTrav.beatloop.volume = 0.7;
        visualTrav.policeloop.volume = 0.7;
        c.globalAlpha = 1;
        var thenumber = Math.floor(visualTrav.eventTimes/3);
        if (visualTrav.m  < thenumber) {
          if (visualTrav.n  < thenumber) {
            c.drawImage(v, (w/thenumber)*visualTrav.n, (h/thenumber)*visualTrav.m , w/thenumber, h/thenumber);
            visualTrav.n++;
          } else {
            visualTrav.m++;
            visualTrav.n = 0;
          }
        } else {
          visualTrav.m = 0;
        }
        var e = document.getElementsByClassName("highcharts-root");
        el = e[0];
        // get svg data
        var xml = new XMLSerializer().serializeToString(el);

        // make it base64
        var svg64 = btoa(xml);
        var b64Start = 'data:image/svg+xml;base64,';

        // prepend a "header"
        var image64 = b64Start + svg64;

        // set it as the source of the img element
        visualTrav.HighImg.src = image64;

        // console.log(visualTrav.HighImg.src);
        c.globalAlpha = 0.1;
        c.globalCompositeOperation = "difference";
        c.drawImage(visualTrav.HighImg, 0, 0, w, h);

        if (visualTrav.drawIndex % wdiv == 0) {
            c.globalAlpha = visualTrav.myPlayBackRate * 0.3;
            c.fill = randomColor();
            c.fillStyle = randomColor();
            c.fillRect(0, 0, w*2, h*2);
          }


      }

      if (visualTrav.cutImage) {
        visualTrav.beatloop.volume = 0.7;
        visualTrav.policeloop.volume = 0.7;
        c.globalAlpha = 0.6;
        var cutW = Math.floor(Math.random() * w);
        var cutH = Math.floor(Math.random() * h);
        c.drawImage(v, 130, 140, 150, 150, cutW, cutH, cutW*2, cutW*2);
      }


    } else { // end of speed only
      c.drawImage(v, 0, 0, w, h, 0, -200, w*2.4, h*2.4);
      visualTrav.beatloop.volume = 0;
      visualTrav.policeloop.volume = 0;
    }

    if (visualTrav.speedOnly) {
        c.drawImage(v, 0, 0, w, h, 0, -200, w*2.4, h*2.4);
    }



    if (visualTrav.total > 500) {
      visualTrav.speedOnly = false;
    }

    if (visualTrav.printMessage) {
        textMessages(c, w);
    }

    var rand = Math.floor(Math.random() * 20);
    if (rand > 19) {
      c.globalAlpha = 0.6;
      c.drawImage(v, 0, 0, w, h, 0, -200, w*2.4, h*2.4);
    }

    if (visualTrav.drawIndex % 100 == 0 && visualTrav.total > 1000) {
      var rand = Math.floor(Math.random() * 10);
      if (rand < 8) {
        visualTrav.speedOnly = true;
      } else {
        visualTrav.speedOnly = false;
      }
      console.log("testing text only")
    }



    c.globalAlpha = 0.5;
    c.fillStyle = "black";
    c.font = "60px Impact";
    (visualTrav.drawIndex % 30 == 0)
      c.globalCompositeOperation = "source-over";

    c.fillText("<3: " +visualTrav.total, w-500, 100);
    c.font = "40px Impact";
    var meter = visualTrav.eventTimes;
    if (meter > 40) {
      meter = 40;
    } else {
      meter = visualTrav.eventTimes;
    }

    for (var g=0; g < meter; g++) {
       c.fillText("^", w-300, 300-g*4);
    }
    if (visualTrav.showPassedFail) {
      c.globalAlpha = 0.3;
      c.fillStyle = "red";
      c.fillRect(w/2, 0, visualTrav.failed*10, h);
      c.fillStyle = "blue";
      c.fillRect(w/2-visualTrav.passed*10, 0, visualTrav.passed*10, h);
    }

    visualTrav.drawIndex++;


    setTimeout(draw,40,v,c,w,h);
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

function decideWhatToPlay() {
  console.log(visualTrav.iterations);
   if (visualTrav.iterations > visualTrav.block1) {

      if (visualTrav.iterations > visualTrav.block1) {
        if (visualTrav.eventTimes < visualTrav.flashColorsLimit) {
          visualTrav.flashColors = true;
        } else {
          visualTrav.flashColors = false;
        }
      }

      if (visualTrav.iterations > visualTrav.block2) {
        if (visualTrav.eventTimes < visualTrav.compositesDistLimit && visualTrav.eventTimes > visualTrav.flashColorsLimit) {
          visualTrav.compositesDist = true;
        } else {
          visualTrav.compositesDist = false;
        }
      }

      if (visualTrav.iterations > visualTrav.block3) {
        if (visualTrav.eventTimes < visualTrav.videoGridLimit && visualTrav.eventTimes > visualTrav.compositesDistLimit) {
          visualTrav.videoGrid = true;
        } else {
          visualTrav.videoGrid = false;
        }
      }
      if (visualTrav.iterations > visualTrav.block3) {

          visualTrav.printMessage = true;

      }

      if (visualTrav.iterations > visualTrav.block4) {
        if (visualTrav.eventTimes < visualTrav.cutImageLimit && visualTrav.eventTimes > visualTrav.videoGridLimit) {
          visualTrav.cutImage = true;
        } else {
          visualTrav.cutImage = false;
        }
      }

    }
      if (visualTrav.iterations > visualTrav.block4) {
          visualTrav.showPassedFail = true;
      }
    console.log("visualTrav.videoGrid ", visualTrav.videoGrid, visualTrav.eventTimes)
}

// the video playback rate should step twards message speed
// if the
function setPlayBackRate() {
  if (!visualTrav.simpelPlaybackRate) {
    if (visualTrav.myPlayBackRate > visualTrav.eventTimes) {
      visualTrav.myPlayBackRate = visualTrav.myPlayBackRate - 0.4;
    } else {
      visualTrav.myPlayBackRate = visualTrav.myPlayBackRate + 0.3;
    }
    if(visualTrav.consoleMessage) {
        console.log("the playback rate is:", visualTrav.myPlayBackRate);
        console.log("eventtime is: ", visualTrav.eventTimes);
    }
  } else {
    visualTrav.myPlayBackRate = visualTrav.eventTimes / 20;
  }

  if (visualTrav.myPlayBackRate < 0.1) {
    visualTrav.myPlayBackRate = 0.3;
  } else if (visualTrav.myPlayBackRate > 15) {
    visualTrav.myPlayBackRate = 14;
  }
  setTimeout(function(){ visualTrav.eventTimes = 0; }, 100);

  if(visualTrav.consoleMessage)
      console.log("playback rate: ", visualTrav.myPlayBackRate, visualTrav.eventTimes);
}


function setAverageMean(myPlayBackRate) {
  visualTrav.loops++;
  visualTrav.total = visualTrav.total + visualTrav.myPlayBackRate;
  visualTrav.mean = visualTrav.total / visualTrav.loops;
  if(visualTrav.consoleMessage)
    console.log("mean is: ", visualTrav.mean);
  if(visualTrav.loops < 100) {
    visualTrav.loops = 0;
    visualTrav.total = 0;
  }
  return visualTrav.mean;
}

function setVideoTime() {
  visualTrav.targetSpeed = (visualTrav.eventTimes / mean) * visualTrav.eventTimes;
  if(visualTrav.consoleMessage)
      console.log(visualTrav.eventTimes);
  setMean(visualTrav.eventTimes);
  visualTrav.eventTimes = visualTrav.eventTimes / 3;
  if(visualTrav.consoleMessage)
      console.log("targetspeed is: ", targetSpeed);
}

function invertColors(data) {
  for (var i = 0; i < data.length; i+= 4) {
    data[i] = data[i] ^ 255; // Invert Red
    data[i+1] = data[i+1] ^ 255; // Invert Green
    data[i+2] = data[i+2] ^ 255; // Invert Blue
  }
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


function randomColor() {
  var r = 255*Math.random()|0,
      g = 255*Math.random()|0,
      b = 255*Math.random()|0
 return 'rgb(' + r + ',' + g + ',' + b + ')';
}

// c is the canvas
function textMessages(c, w) {
  for (var d = 0; d < visualTrav.eventTimes/4; d++) {
      var move = visualTrav.drawIndex % 200;
      c.globalAlpha = 0.9;
      c.fill = randomColor();
      c.fillStyle = randomColor();
      c.font = Math.floor(Math.random() * 80)+"px " + visualTrav.fonts[Math.floor(Math.random() * visualTrav.fonts.length)];
      //c.fillText(visualTrav.eventTimes, 100 , 100);
      c.fillText(visualTrav.message, Math.floor(Math.random() * 800), Math.floor(Math.random() * 100 + 400)+move+(d*3));
      c.fillText(visualTrav.eventTimes, Math.floor(Math.random() * 400), Math.floor(Math.random() * 100 + 400)+move+(d*3));
      if(visualTrav.consoleMessage)
         c.fillText("Eventtime is: " +visualTrav.eventTimes, 100, 100)
      c.strokeStyle = randomColor();
      c.lineWidth = Math.floor(Math.random() * 6);
      c.beginPath();
      c.moveTo(0,move+400);
      c.lineTo(2000,move+400);
      c.stroke();
    }
}

function initSetData() {
  var settheplaybackrate =  visualTrav.myPlayBackRate / (visualTrav.playbackReduction);
  var halfsetplaybackrate =  visualTrav.myPlayBackRate / (visualTrav.playbackReduction*2);
  if (settheplaybackrate < 0.1) {
    settheplaybackrate = 0.1;
  }
  if (halfsetplaybackrate < 0.1) {
    halfsetplaybackrate = 0.1;
  }

  if (settheplaybackrate > 16) {
    settheplaybackrate = 15;
  }
  if (halfsetplaybackrate > 16) {
    halfsetplaybackrate = 15;
  }
  visualTrav.myVideo.playbackRate = settheplaybackrate;
  visualTrav.beatloop.playbackRate = halfsetplaybackrate;
  visualTrav.policeloop.playbackRate = visualTrav.beatloop.playbackRate;
}
