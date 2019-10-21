import { type } from 'https://unpkg.com/@camwiegert/typical';

(async () => {
    const lines = []

    async function write(text) {
        const promises = []
        const s = text.split('\n')
        for (let i = 0; i< s.length; i ++) {
            if (s[i] != lines[i]) {
                promises.push(type(document.getElementById('target-'+ (i + 1)), lines[i], s[i]), 500);
                lines[i] = s[i]
            }
        }
        await Promise.all(promises)
    }
    await write(poets[0])
    for (let i = 0; i< poets.length; i ++) {
        document.getElementById("id").innerText = i
        await write(poets[i])
    }
})()
