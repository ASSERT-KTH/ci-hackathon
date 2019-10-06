var jobs = {};
var bpm = {}
var even = false;
var current = -1;
var values = [-0.04, 
  -0.08, 0.3, 0.7, 0.3, -0.17, 0.00, 0.04, 0.04, 
  0.05, 0.05, 0.06, 0.07, 0.08, 0.10, 0.11, 0.11, 
  0.10, 0.085, 0.06, 0.04, 0.03, 0.01, 0.01, 0.01, 
  0.01, 0.02, 0.03, 0.05, 0.05, 0.05, 0.03, 0.02].reverse();
(function() {
  var canvas = document.getElementById('test');

  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          drawStuff(); 
  }
  resizeCanvas();

  function event(job) {
    if (job.started_at) {
      var d = moment(job.started_at).add(60, 'seconds')
      var key = d.format('YYYYMMDDhhmmss')
      var key_minute = d.format('YYYYMMDDhhmm')
      if (!bpm[key_minute]) {
        bpm[key_minute] = 0
      }
      bpm[key_minute]++
      if (!jobs[key]) {
        jobs[key] = 0
      }
      jobs[key] ++
    }
  }
  travisListener.on('job', event)
  travisListener.on('job_updated', event)
  travisListener.connect()

  var ecg = null;
  function drawStuff() {
    if (ecg) {
      ecg.stop()
    }
    ecg = new PlethGraph("test", function () {
      var value = Math.random()/50;
      if (even) {
        value *= -1
      }
      var key = moment().format('YYYYMMDDhhmmss')
      var key_minute = moment().subtract(1, 'minutes').format('YYYYMMDDhhmm')
      $('#bpm .value').text(bpm[key_minute] || 0)
      
      if (jobs[key]) {
        current = values.length -1;
        delete jobs[key];
      }
      if (current > -1) {
        value = values[current]
        current --;
      }
      even = !even;
      return [value]
    })
    ecg.start()
  }
})();

