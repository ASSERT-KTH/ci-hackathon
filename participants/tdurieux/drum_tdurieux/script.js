function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function strToRGB(i){
    i = hashCode(i)
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "#" + "00000".substring(0, 6 - c.length) + c;
}


let deviations = 0.03;
Tone.Transport.bpm.value = 200;
let maxLiveTime = 10000

let patternLength = 6;

// Deep House Drum Samples from soundpacks.com.
// https://soundpacks.com/free-sound-packs/deep-house-drum-samples/
const drumFileNames = {
    clap: [
      'clp_analogue.mp3',
      'clp_applause.mp3',
      'clp_basics.mp3',
      'clp_can.mp3',
      'clp_clap10000.mp3',
      'clp_classic.mp3',
      'clp_clipper.mp3',
      'clp_delma.mp3',
      'clp_donuts.mp3',
      'clp_drastik.mp3',
      'clp_eternity.mp3',
      'clp_happiness.mp3',
      'clp_kiddo.mp3',
      'clp_knowledge.mp3',
      'clp_kournikova.mp3',
      'clp_raw.mp3',
      'clp_scorch.mp3',
      'clp_socute.mp3',
      'clp_sustained.mp3',
      'clp_tayo.mp3',
      'clp_tense.mp3',
      'clp_thinlayer.mp3',
      'clp_verona.mp3'
    ],
    hat: [
      'hat_bestfriend.mp3',
      'hat_omgopen.mp3',
      'hat_bigdeal.mp3',
      'hat_openiner.mp3',
      'hat_blackmamba.mp3',
      'hat_original.mp3',
      'hat_chart.mp3',
      'hat_quentin.mp3',
      'hat_charter.mp3',
      'hat_rawsample.mp3',
      'hat_chipitaka.mp3',
      'hat_retired.mp3',
      'hat_sampleking.mp3',
      'hat_samplekingdom.mp3',
      'hat_closer.mp3',
      'hat_sharp.mp3',
      'hat_collective.mp3',
      'hat_soff.mp3',
      'hat_crackers.mp3',
      'hat_spreadertrick.mp3',
      'hat_critters.mp3',
      'hat_stereosonic.mp3',
      'hat_cuppa.mp3',
      'hat_tameit.mp3',
      'hat_darkstar.mp3',
      'hat_vintagespread.mp3',
      'hat_deephouseopen.mp3',
      'hat_void.mp3',
      'hat_drawn.mp3',
      'hat_freekn.mp3',
      'hat_gater.mp3',
      'hat_glitchbitch.mp3',
      'hat_hatgasm.mp3',
      'hat_hattool.mp3',
      'hat_jelly.mp3',
      'hat_kate.mp3',
      'hat_lights.mp3',
      'hat_lilcloser.mp3',
      'hat_mydustyhouse.mp3',
      'hat_ace.mp3',
      'hat_myfavouriteopen.mp3',
      'hat_addverb.mp3',
      'hat_negative6.mp3',
      'hat_analog.mp3',
      'hat_nice909open.mp3',
      'hat_bebias.mp3',
      'hat_niner0niner.mp3'
    ],
    prc: [
      'prc_home.mp3',
      'prc_itgoespop.mp3',
      'prc_jungledrummer.mp3',
      'prc_knockknock.mp3',
      'prc_reworked.mp3',
      'prc_rolled.mp3',
      'prc_syntheticlav.mp3',
      'prc_trainstation.mp3',
      'prc_u5510n.mp3',
      'prc_vinylshot.mp3',
      'prc_virustiatmos.mp3',
      'prc_youpanit.mp3',
      'prc_808rimmer.mp3',
      'prc_bigdrum.mp3',
      'prc_bongodrm.mp3',
      'prc_bongorock.mp3',
      'prc_boxed.mp3',
      'prc_change.mp3',
      'prc_clav.mp3',
      'prc_congaz.mp3',
      'prc_dnthavacowman.mp3',
      'prc_drop.mp3',
      'prc_emtythepot.mp3',
      'prc_flickingabucket.mp3',
      'prc_foryoursampler.mp3',
      'prc_harmony.mp3',
      'prc_hit.mp3'
    ],
    shaker_tam: [
      'tam_christmassy.mp3',
      'tam_extras.mp3',
      'tam_hohoho.mp3',
      'tam_lifein2d.mp3',
      'tam_mrhat.mp3',
      'shaker_bot.mp3',
      'shaker_broom.mp3',
      'shaker_command.mp3',
      'shaker_halfshake.mp3',
      'shaker_pause.mp3',
      'shaker_quicky.mp3',
      'shaker_really.mp3'
    ],
    snare: [
      'snr_mpc.mp3',
      'snr_myclassicsnare.mp3',
      'snr_owned.mp3',
      'snr_royalty.mp3',
      'snr_rusnarious.mp3',
      'snr_truevintage.mp3',
      'snr_analogging.mp3',
      'snr_answer8bit.mp3',
      'snr_bland.mp3',
      'snr_drm909kit.mp3',
      'snr_dwreal.mp3',
      'snr_housey.mp3'
    ],
    tom: [
      'tom_909fatty.mp3',
      'tom_909onvinyl.mp3',
      'tom_cleansweep.mp3',
      'tom_dept.mp3',
      'tom_discodisco.mp3',
      'tom_eclipse.mp3',
      'tom_enriched.mp3',
      'tom_enrico.mp3',
      'tom_greatwhite.mp3',
      'tom_iloveroland.mp3',
      'tom_madisonave.mp3',
      'tom_ofalltoms.mp3',
      'tom_summerdayze.mp3',
      'tom_taste.mp3',
      'tom_vsneve.mp3'
    ],
    bd_kick: [
      'bd_909dwsd.mp3',
      'bd_chicago.mp3',
      'bd_dandans.mp3',
      'bd_deephouser.mp3',
      'bd_diesel.mp3',
      'bd_dropped.mp3',
      'bd_flir.mp3',
      'bd_gas.mp3',
      'bd_ghost.mp3',
      'bd_hybrid.mp3',
      'bd_isampleoldskool.mp3',
      'bd_liked.mp3',
      'bd_mainroom.mp3',
      'bd_mirror.mp3',
      'bd_nash.mp3',
      'bd_newyear.mp3',
      'bd_organicisin.mp3',
      'bd_outdoor.mp3',
      'bd_shoein.mp3',
      'bd_sodeep.mp3',
      'bd_sonikboom.mp3',
      'bd_streek.mp3',
      'bd_stripped.mp3',
      'bd_sub808.mp3',
      'bd_tech.mp3',
      'bd_tripper.mp3',
      'bd_uma.mp3',
      'bd_untitled.mp3',
      'bd_vintager.mp3',
      'bd_vinylinstereo.mp3'
    ]
  };
  
  const drumBuffers = _.transform(
    drumFileNames,
    (res, names, group) =>
      (res[group] = names.map(f => new Tone.Buffer(`https://s3-us-west-2.amazonaws.com/s.cdpn.io/969699/${f}`))),
    {}
  );
  
  class Cell {
    constructor() {
      this.color = '#EC407A'
      this.timeout = null;
      this.full = redom.el('div.full');
      this.parts = [
        redom.el('div.part'),
        redom.el('div.part'),
        redom.el('div.part')
      ];
      this.el = redom.el('div.cell', [
        this.full,
        redom.el('div.parts', this.parts)
      ]);
      this.model = { active: false, probability: 0 };
      this.playing = false;
      this.el.addEventListener('click', () => {
        this.toggle();
      });
    }

    toggle() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.model.active = !this.model.active;
        this.model.probability = 1 - this.model.probability;
        this.update(this.model);
        if (this.model.active) {
            this.timeout = setTimeout(() => {
                this.toggle()
                triggerLight(this.lightId(), "#000000")
            }, maxLiveTime);
        }
    }
  
    update(model) {
      const baseColor = `hsl(0, 0%, ${20 + model.probability * 70}%)`;
      redom.setAttr(this.el, {
        style: {
          backgroundColor: baseColor,
          zIndex:
            model.playing !== this.model.playing
              ? triggerCounter++ % 1000
              : this.el.style.zIndex
        }
      });
      this.triggerAnimation(model.playing, baseColor);
      this.model = model;
      this.playing = model.playing;
    }

    lightId() {
      var parent = this.el.parentNode;
      var y = Array.prototype.indexOf.call(parent.parentNode.children, parent);
      var x = 4 - Array.prototype.indexOf.call(parent.children, this.el) - 1;
      if (y % 2 != 0) {
        x = 4 - x;
      }
      return (x * patternLength) + y + 1
    }
  
    triggerAnimation(playing, baseColor) {
      const parent = this.el.parentNode;
      if (this.el && parent && playing != null) {
        triggerLight(this.lightId(), this.color)
      }
      if (playing === 'all' && this.playing !== 'all') {
        this.animateTrigger(this.el, this.color, baseColor);
      }
      this.parts.forEach((part, idx) => {
        const triggerAnimation = playing === idx && this.playing !== idx;
        if (triggerAnimation) this.animateTrigger(part, this.color, 'inherit');
      });
    }
  
    animateTrigger(el, fromColor, toColor) {
      el.animate(
        [
          {
            backgroundColor: fromColor,
            transform: 'translateZ(30px)'
          },
          { backgroundColor: toColor, transform: 'translateZ(0)' }
        ],
        {
          duration: 750,
          easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        }
      );
    }
  }
  
  class Column {
    constructor() {
      this.el = redom.el('div.column');
      this.list = redom.list(this.el, Cell);
    }
    update({ drums, isCurrentStep }) {
      this.list.update(drums);
    }
   }
  
  const players = [];
  const sequencerComponent = redom.list('div.sequencer.mdl-shadow--6dp', Column);
  
  const getCells = function () {
    const output = []
    for (let column of sequencerComponent.views) {
        for (let cell of column.list.views) {
            output.push(cell)
        }    
    }
    return output
  }
  
  let drumPattern = generatePattern(
    patternLength,
    deviations
  );
  let triggerCounter = 0;
  
  function getStepGain(step, patternLength) {
    if (step === 0) {
      return 1;
    } else if (step === Math.round(patternLength / 2)) {
      return 0.7;
    } else {
      return 0.3;
    }
  }
  
  function generatePattern(patternLength, deviations) {
    const activeDrums = [
      _.sample(drumBuffers.bd_kick),
      _.sample(drumBuffers.hat),
      // _.sample(drumBuffers.prc),
      _.sample(drumBuffers.tom),
      // _.sample(drumBuffers.snare),
      _.sample(drumBuffers.clap),
      // _.sample(drumBuffers.shaker_tam)
    ];
    return _.range(patternLength).map(step => ({
      step,
      time: '8n * ' + step,
      drums: activeDrums.map(drum => {
        const gain = getStepGain(step, patternLength);
        const active = false;
        const probability = active ? 1 - deviations / 2 : deviations / 2;
        return {
          drum,
          gain,
          active,
          probability
        };
      })
    }));
  }
  
  function renderSequencer(drumPattern) {
    sequencerComponent.update(drumPattern);
  }
  
  function playPart(time, { drums, step }) {
    const renderings = new Map();
    drums.forEach(drum => {
      const probability = drum.active ? 1 - deviations / 2 : 0;
      if (drum.active) {
        const delayProbability = deviations / 2;
        const tripletProbability = deviations / 3;
        const isDelayed = Math.random() < delayProbability;
        const isTriplet = !isDelayed && Math.random() < tripletProbability;
        const triggers = isTriplet
          ? [
              { time: time, render: 0 },
              { time: time + '+16t', render: 1 },
              { time: time + '+16t+16t', render: 2 }
            ]
          : [{ time: isDelayed ? time + '+16n' : time, render: 'all' }];
        for (const { time, render } of triggers) {
          const player = new Tone.Player(drum.drum)
            .connect(new Tone.Gain(drum.gain).toMaster())
            .start(time);
          players.push(player);
          if (!renderings.has(time)) renderings.set(time, []);
          renderings.get(time).push({ drum, render });
        }
      }
    });
    Tone.Draw.schedule(() => {
      drumPattern.forEach(pt => {
        pt.drums.forEach(d => (d.playing = null));
      });
      renderSequencer(drumPattern);
    }, time);
    for (const [renderTime, drumRenderings] of renderings.entries()) {
      Tone.Draw.schedule(() => {
        drumRenderings.forEach(({ drum, render }) => {
          drum.playing = render;
        });
        renderSequencer(drumPattern);
      }, renderTime);
    }
  }
  
  Tone.Transport.timeSignature = patternLength / 2;
  renderSequencer(drumPattern);
  
  const part = new Tone.Part(playPart, drumPattern).start();
  part.loop = true;
  
  function regenerate() {
    drumPattern = generatePattern(patternLength, deviations);
    drumPattern.forEach(pt => {
      part.at(pt.time, pt);
    });
    renderSequencer(drumPattern);
  }
  
  
  redom.mount(document.querySelector('#sequencer'), sequencerComponent);
  travisListener.connect()

  Tone.Buffer.on('load', () => {
    document.querySelector('#loading').remove();
    document.querySelector('#sequencer').style.display = 'flex';
    travisListener.on('job', job => {
        const cells = getCells()
        const cell = cells[Math.floor(Math.random() * cells.length)]
        cell.toggle()
        cell.color = strToRGB(job.commit.message)
    })
    Tone.Transport.start();
    setInterval(() => {
      while (players.length && players[0].state === 'stopped') {
        players.shift().dispose();
      }
    }, 5000);
  });
  
  StartAudioContext(Tone.context, '#sequencer');

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function triggerLight(lightId, color) {
  color = hexToRgb(color)
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    document.getElementById("demo").innerHTML = this.responseText;
    }
  };
  xhttp.open("POST", "https://lights.ciart.live/setcolor", true);
  xhttp.send(JSON.stringify({
    "id": lightId,
    "color": [color.r, color.g, color.b],
    "session": "main"
  }));
}