import { type } from './typical.js';

(async () => {
    const lines = []

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

    read = function () {
        const voices = synth.getVoices().filter(v => v.localService && v.lang.indexOf('en-') == 0)
        for (let line of lines) {
            var utterThis = new SpeechSynthesisUtterance(line);
            utterThis.voice = voices[0];
            utterThis.pitch = 1;
            utterThis.rate = Math.min(Math.random() + 0.85, 1.15);
            synth.speak(utterThis);
        }
    }
    
    let content = '';
    for (let t of dates) {
        const d = new Date(t);
        // d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
        const datestring = ("0" + d.getHours()).slice(-2) + "h" + ("0" + d.getMinutes()).slice(-2);

        content += '<div id="time-' + t + '" class="time" onclick="activate(this)" data-value="' + t + '"><span>' + datestring + '</span></div>'
    }
    time_travel.innerHTML = content;

    
    display = async function() {
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
    }

    await display()
})()
