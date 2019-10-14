// adapted from here: https://sccode.org/1-5ay


// 1. define the synth
(
SynthDef(\bell, {
	|fs=1, t60=1, pitchy=1, amp=0.25, gate=1|
	var sig, exciter;
	//exciter = Impulse.ar(0);
	exciter = WhiteNoise.ar() * EnvGen.ar(Env.perc(0.001, 0.05), gate) * 0.25;
	sig = Klank.ar(
		`[
			[1, 2, 2.803, 3.871, 5.074, 7.81, 10.948, 14.421],   // freqs
			[1, 0.044, 0.891, 0.0891, 0.794, 0.1, 0.281, 0.079], // amplitudes
			[1, 0.205, 1, 0.196, 0.339, 0.047, 0.058, 0.047]*t60     // ring times
		],
		exciter,
		freqscale:fs*pitchy);
	sig = FreeVerb.ar(sig) * amp;
	DetectSilence.ar(sig, 0.001, 0.5, doneAction:2);
	Out.ar(0, sig!2);
}).add
)

( // less inharmonic
SynthDef(\bell, {
	|fs=1, t60=1, pitchy=1, amp=0.25, gate=1|
	var sig, exciter, env;

	env = EnvGen.ar(
		Env.perc(\atk.kr(0.5), t60),
		doneAction:2
	);

	//exciter = Impulse.ar(0);
	exciter = WhiteNoise.ar() * EnvGen.ar(Env.perc(0.001, 0.05), gate) * 0.25;
	sig = Klank.ar(
		`[
			[1, 2, 2.803, 3.871, 5.074, 7.81, 10.948, 14.421],   // freqs
			[1, 0.044, 0.391, 0.0891, 0.794, 0.1, 0.281, 0.079], // amplitudes
			[1, 0.205, 0.2, 0.196, 0.209, 0.047, 0.058, 0.047]*t60     // ring times
		],
		exciter,
		freqscale:fs*pitchy);
	sig = FreeVerb.ar(sig, 0.05) * amp * env;
	DetectSilence.ar(sig, 0.001, 0.5, doneAction:2);
	Out.ar(0, sig!2);
}).add
)


// 2. Test a single note
x = Synth(\bell, [\fs, 60.midicps, \t60, 9.177, \pitchy, 4]);

x = Synth(\bell, [\fs, 31.midicps, \t60, 12.177, \pitchy, 4]);
x = Synth(\bell, [\fs, (31.midicps)*3, \t60, 9.177, \pitchy, 4]);
x = Synth(\bell, [\fs, 31.midicps*5, \t60, 9.177, \pitchy, 4]);
x = Synth(\bell, [\fs, 31.midicps*6, \t60, 7.177, \pitchy, 4]);
x = Synth(\bell, [\fs, 31.midicps*8, \t60, 6.177, \pitchy, 4]);
x = Synth(\bell, [\fs, 31.midicps*8/5, \t60, 5.177, \pitchy, 4]);


// 3. Test different textures

// glokenspiel
(
Pbind(
	\instrument, \bell,
	\fs, Pseq( (60..72), 1).midicps,
	\t60, 6,
	\pitchy, 4,
	\dur, 0.25
).play;
)

// tubular bells
(
Pbind(
	\instrument, \bell,
	\fs, Pseq( (60..72), 1).midicps,
	\t60, 9,
	\pitchy, 1,
	\dur, 1
).play;
)

// xilophone
(
Pbind(
	\instrument, \bell,
	\fs, Pseq( (60..72), 1).midicps,
	\t60, 1,
	\pitchy, 4,
	\dur, 0.25
).play;
)

// marimba
(
Pbind(
	\instrument, \bell,
	\fs, Pseq( (60..72), 1).midicps,
	\t60, 0.5,
	\pitchy, 1,
	\dur, 0.25
).play;
)