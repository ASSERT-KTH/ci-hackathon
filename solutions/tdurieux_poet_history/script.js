const dates = Object.keys(poems).map(t => parseInt(t)).sort()
const lines = []
let index = 0;
const synth = window.speechSynthesis;
let isRunning = true;
let isActive = false;


let display = async function() {
    if (isActive) {
        return;
    }
    if (index >= dates.length) {
        index = 0;
    }
    isActive = true;
    document.getElementById("id").innerHTML = (index+1);
    await write(dates[index], poems[dates[index]])
    isActive = false;
    if (isRunning) {
        await display(++index);
    }
};

let read = function () {
    const voices = synth.getVoices().filter(v => v.localService && v.lang.indexOf('en-') == 0)
    for (let line of lines) {
        var utterThis = new SpeechSynthesisUtterance(line);
        utterThis.voice = voices[0];
        utterThis.pitch = 1;
        utterThis.rate = Math.min(Math.random() + 0.85, 1.15);
        synth.speak(utterThis);
    }
};
document.body.onmousedown = document.body.ontouchstart = function (e) {
    if (e.target.className.indexOf('time') > -1) {
        return;
    }
    pause();
}
document.body.onmouseup = document.body.ontouchend = function (e) {
    if (e.target.className.indexOf('time') > -1) {
        return;
    }
    resume();
}
document.body.onkeydown = function (e) {
    // space
    if (e.keyCode == 32) {
        if (isRunning) {
            pause();
        } else {
            resume();
        }
    // down & right
    } else if (e.keyCode == 39 || e.keyCode == 40) {
        pause();
        index++;
        display();
    // up & left
    } else if (e.keyCode == 37 || e.keyCode == 38) {
        pause();
        index--;
        display();
    }
}

let onClickTimeout = null;
let pause = function (e) {
    if (synth.speaking) {
        synth.cancel()
    }
    onClickTimeout = setTimeout(() => {
        document.body.className = 'pause';
        isRunning = false;
        read();
    }, 150)
};

let resume = function () {
    clearTimeout(onClickTimeout)
    if (synth.speaking) {
        synth.cancel()
    }
    document.body.className = '';
    isRunning = true;
    display();
};

function activate(e) {
    index = dates.indexOf(parseInt(e.getAttribute('data-value'))) - 1
}
async function write(t, text) {
    const promises = []
    const s = text.split('\n')
    for (let i = 0; i< s.length; i ++) {
        if (s[i] != lines[i]) {
            promises.push(type(document.getElementById('target-'+ (i + 1)), lines[i], s[i]), 500);
            lines[i] = s[i]
        }
    }
    const previous = document.querySelector('.time.active')
    if (previous) {
        previous.className = 'time'
    }
    document.getElementById('time-'+ t).className = 'time active'
    await Promise.all(promises)
}
function initTimeline() {
    let content = '';
    for (let t of dates) {
        const d = new Date(t);
        // d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
        const dateString = ("0" + d.getHours()).slice(-2) + "h" + ("0" + d.getMinutes()).slice(-2);

        content += '<div id="time-' + t + '" class="time" onclick="activate(this)" data-value="' + t + '"><span>' + dateString + '</span></div>'
    }
    time_travel.innerHTML = content;
}

(async () => {
    initTimeline();
    await display()
})()
