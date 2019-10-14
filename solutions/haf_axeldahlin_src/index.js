import { Elm } from './Main.elm'
import registerServiceWorker from './registerServiceWorker'
import 'webaudiofont'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'

const app = Elm.Main.init({
  node: document.getElementById('root')
})

// Websocket:
travisListener.connect();
travisListener.on('job', (job, type) => {
  const json = JSON.stringify({
    type,
    job
  })
  // console.log(type, job)
  app.ports.websocketIn.send(json)
})

// Audio playback:

const AudioContextFunc = window.AudioContext || window.webkitAudioContext
let audioContext = null
let player = null
let current = null

function initialize() {
  if (audioContext == null) {
    audioContext = new AudioContextFunc()
  }

  if (player == null){
    player = new WebAudioFontPlayer()
  }
}

app.ports.stop.subscribe(function () {
  app.ports.musicStopped.send("")
  player.cancelQueue(audioContext)
})

app.ports.play.subscribe(function (data) {
  initialize()
  console.log('play port received:',  data)

  data.instruments.forEach(function (instrument) {
    const info = player.loader.instrumentInfo(instrument)
    player.loader.startLoad(audioContext, info.url, info.variable)
  })

  data.drums.forEach(function (drum) {
    const info = player.loader.drumInfo(drum)
    player.loader.startLoad(audioContext, info.url, info.variable)
  })

  player.loader.waitLoad(function () {
    player.cancelQueue(audioContext)

    const startTime = audioContext.currentTime + 0.5
    const duration = 0.5 + data.events.map(x => x.duration).reduce((sum, n) => sum + n, 0)

    console.log('setting timeout in ', duration)
    if (current != null) {
      clearTimeout(current);
      app.ports.musicStopped.send("")
    }
    current = setTimeout(() => {
      app.ports.musicStopped.send("")
    }, duration * 1000)

    setTimeout(() => {
      app.ports.musicStarted.send("")
    }, 500)

    data.events.forEach(function (event) {
      if (event.instrument.type == 'percussion') {
        const info = player.loader.drumInfo(event.instrument.key)
        const time = startTime + event.time
        player.queueWaveTable(audioContext, audioContext.destination, window[info.variable], time, event.pitch, event.duration, event.volume)
      } else if (event.instrument.type == 'regular') {
        const info = player.loader.instrumentInfo(event.instrument.key)
        const time = startTime + event.time
        player.queueWaveTable(audioContext, audioContext.destination, window[info.variable], time, event.pitch, event.duration, event.volume)
      } else {
        // should not happen
      }
    })
  })

  return false
})

registerServiceWorker()
