# The King of CI Fighters

## What Is The Idea?

[The King of Fighters](https://en.wikipedia.org/wiki/The_King_of_Fighters) is a series of fighting games by SNK that began with the release of The King of Fighters '94 in 1994. The idea is to visualize Travis CI data in KOF-97.

As we know, by using Travis CI API we could get a bunch of CI events. The states of events include `errored`, `canceled`, `failed`, `passed`, etc. I am curious about what is the distribution of these states in all finished Travis jobs. If in KOF-97, one fighter stands for all `passed` events, another stands for the rest of events, who will most likely win the match?

## How Does It Look Like?

![Iori](https://vignette.wikia.nocookie.net/snk/images/e/e8/Iori96.gif/revision/latest?cb=20100416140138)

Iori stands for successfull builds.

![Kyo](https://vignette.wikia.nocookie.net/snk/images/2/26/Kyo97.gif/revision/latest?cb=20100417163030)

Kyo stands for other build states, such as `failed`, `canceled`, `errored`, etc.

Every action in the fight is determined by 5 finished jobs in Travis CI:

- 5 builds are `passed`: total success, Iori gives a super special move.  
- 4 builds are `passed`: big success, Iori gives a heavy punch  
- 3 builds are `passed`: small success, Iori gives a light punch  
- 2 builds are `passed`: small failure, Kyo gives a light punch  
- 1 build is `passed`: big failure, Kyo gives a heavy punch  
- 0 build is `passed`: total failure, Kyo gives a super special move.  

A short video to show such an interesting fight:

<iframe width="560" height="315" src="https://www.youtube.com/embed/94_OSJQFY9Q" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## How Is This Implemented?

The script is written in Python2. Thanks to the nice Travis builds websocket provided by Thomas Durieux, all Travis build events are fetched regularly. Then all `job_finished` events are added into a queue. Another subthread picks 5 builds from the queue every time, then calculates fighters' action based on the rules above. These actions are sent to the game emulator by another subthread. During my testing, KOF-97 is running in a [Wine](https://www.winehq.org/) environment.

Dependencies:  
- `pip install websocket_client`  
- `sudo apt-get install xdotool`


## One More Thing

This is just a visualization idea about Travis CI data. No matter a job is `passed` or not, it helps developers to test their project. So don't take the fighting result seriously, just enjoy a KOF-97 fight controlled by CI data :)