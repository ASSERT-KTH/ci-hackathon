var eventTimes = 0;
var y = 0;
ws = new WebSocket("wss://travis.durieux.me");

var myVideo = document.getElementById("myVideo");
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
  console.log(eventTimes * 0.1);
  if (eventTimes > 2) {
    myVideo.playbackRate = eventTimes * 0.05;
    y = eventTimes;
  }
  eventTimes = 0;
}, 1000);



// in the onmessage funtion we can increment the eventTime variable that will hold number of commits per seconds
ws.onmessage = function(event) {
  eventTimes = eventTimes + 1;
};

Highcharts.chart('container', {
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
                }, 1000);
            }
        }
    },

    time: {
        useUTC: false
    },

    title: {
        text: 'Travis the playing dog'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'Video Speed'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
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
