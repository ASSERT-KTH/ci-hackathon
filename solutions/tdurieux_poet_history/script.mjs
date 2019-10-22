import { type } from './typical.js';

function changeTimezone(date, ianatz) {
    return date;
    // suppose the date is 12:00 UTC
    var invdate = new Date(date.toLocaleString('en-GB', {
      timeZone: ianatz
    }));
    console.log(invdate)
  
    // then invdate will be 07:00 in Toronto
    // and the diff is 5 hours
    var diff = date.getTime() - invdate.getTime();
  
    // so 12:00 in Toronto is 17:00 UTC
    return new Date(date.getTime() - diff);
}

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
    
    let content = '';
    for (let t of dates) {
        const d = new Date(t);
        // d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " " +
        const datestring = ("0" + d.getHours()).slice(-2) + "h" + ("0" + d.getMinutes()).slice(-2);

        content += '<div id="time-' + t + '" class="time" onclick="activate(this)" data-value="' + t + '"><span>' + datestring + '</span></div>'
    }
    time_travel.innerHTML = content;
    await write(dates[0], poems[dates[0]])
    for (index; index < dates.length; index ++) {
        document.getElementById("id").innerText = index
        await write(dates[index], poems[dates[index]])
    }
})()
