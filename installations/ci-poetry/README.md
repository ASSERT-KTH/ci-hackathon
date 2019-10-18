# Generative poetry based on CI

## Description

This installation is a simplified model of collaborative coding realised as an interactive installation. A poem is collectively edited by 12 "poets" and the resulting poem is continually sonified as well as projected as text on the walls of the nuclear reactor R1.

12 rails were equipped with capacitive sensors which were connected to a Raspberry Pi 4 using an Adafruit MPR121 capacitive touch board. Every sensor controls a very opinionated poet which when activated edits a line in the master poem to be like a line in their own personal poem. It then tries to merge its changes which will fail if another poet has already changed that line in the master poem.

### Sensors

Using Raspberry Pi 4: [Adafruit_MPR121](https://circuitpython.readthedocs.io/projects/mpr121/en/latest/index.html)

### Visualization

Uses Processing, requires library [oscP5](http://www.sojamo.de/libraries/oscP5/)

### Sonification

Uses [SuperCollider](https://supercollider.github.io/) and the text-to-speach engine [festival](http://www.cstr.ed.ac.uk/projects/festival/).

## How to run

From the root folder of the installation, run

```
python3 ./python/serial-to-osc.py
```

Then open `supercollider_src/main.scd` and run the code at the first block of the file. At the bottom of the file there are functions for simulating sensor touches if no sensors are available.

Open `visualization/poem/poem.pde` in Processing and run the program.