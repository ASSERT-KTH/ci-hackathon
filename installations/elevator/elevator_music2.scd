(
//cleanup
Pdef.all.do(_.clear);
Pbindef.all.do(_.clear);
~wt_buf.do(_.free);
t.stop;
//initialization
s = Server.local;
s.newBusAllocators;

s.waitForBoot({

	//10 wavetables with increasing complexitymovementRecord
	~wt_sig = 10.collect({
		arg i;

		//random number of envelope segments
		var numSegs = i.linexp(0,9,4,40).round;

		Env(
			//env always begins and ends with zero
			//inner points are random from -1.0 to 1.0
			[0]++({1.0.rand}.dup(numSegs-1) * [1,-1]).scramble++[0],

			//greater segment duration variety in higher-index wavetables
			{exprand(1,i.linexp(0,9,1,50))}.dup(numSegs),

			//low-index wavetables tend to be sinusoidal
			//high index wavetables tend to have sharp angles and corners
			{[\sine,0,exprand(1,20) * [1,-1].choose].wchoose([9-i,3,i].normalizeSum)}.dup(numSegs)
		).asSignal(1024);
	});

	//load into 10 buffers in wavetable format
	~wt_buf = Buffer.allocConsecutive(10, s, 2048, 1, {
		arg buf, index;
		buf.setnMsg(0, ~wt_sig[index].asWavetable);
	});

	SynthDef(\osc, {
		arg buf=0, freq=200, detune=0.2,
		amp=0.2, pan=0, out=0, rout=0, rsend=(-20),
		atk=0.01, sus=1, rel=0.01, c0=1, c1=(-1);
		var sig, env, detuneCtrl;
		env = EnvGen.ar(
			Env([0,1,1,0],[atk,sus,rel],[c0,0,c1]),
			doneAction:2
		);

		//array of eight Oscs with uniquely detune frequencies
		//and unique initial phase offsets
		detuneCtrl = LFNoise1.kr(0.1!8).bipolar(detune).midiratio;
		sig = Osc.ar(buf, freq * detuneCtrl, {Rand(0,2pi)}!8);

		sig = Splay.ar(sig); //spread 8 signals over stereo field
		sig = LeakDC.ar(sig); //remove DC bias
		sig = Balance2.ar(sig[0], sig[1], pan, amp); //L/R balance (pan)
		sig = sig * env;
		Out.ar(out, sig);
		Out.ar(rout, sig * rsend.dbamp); //"post-fader" send to reverb
	}).add;

	SynthDef(\sus_osc, {
		arg buf=0, freq=200, detune=0.2,
		amp=0.2, pan=0, out=0, rout=0, rsend=(-20),
		atk=0.01, sus=1, rel=0.01, c0=1, c1=(-1);
		var sig, env, detuneCtrl;
		amp = Lag.kr(amp, 0.5);
		freq = Lag.kr(freq, \portamento.kr(0.1));
		env = EnvGen.ar(
			Env([0,1,1,0],[atk,sus,rel],[c0,0,c1], releaseNode: 1),
			gate: \gate.kr(1),
			doneAction:2
		);

		//array of eight Oscs with uniquely detune frequencies
		//and unique initial phase offsets
		detuneCtrl = LFNoise1.kr(0.1!8).bipolar(detune).midiratio;
		sig = Osc.ar(buf, freq * detuneCtrl, {Rand(0,2pi)}!8);

		sig = Splay.ar(sig); //spread 8 signals over stereo field
		sig = LeakDC.ar(sig); //remove DC bias
		sig = Balance2.ar(sig[0], sig[1], pan, amp); //L/R balance (pan)
		sig = sig * env;
		Out.ar(out, sig);
		Out.ar(rout, sig * rsend.dbamp); //"post-fader" send to reverb
	}).add;

	//fm synth
	SynthDef(\fm, {
		arg freq=500, mRatio=1, cRatio=1,
		index=1, iScale=5, cAtk=4, cRel=(-4),
		amp=0.2, atk=0.01, rel=3, pan=0,
		out=0, fx=0, fxsend=(-25);
		var car, mod, env, iEnv;

		//index of modulation
		iEnv = EnvGen.kr(
			Env(
				[index, index*iScale, index],
				[atk, rel],
				[cAtk, cRel]
			)
		);

		//amplitude envelope
		env = EnvGen.kr(Env.perc(atk,rel,curve:[cAtk,cRel]),doneAction:2);

		//modulator/carrier
		mod = SinOsc.ar(freq * mRatio, mul:freq * mRatio * iEnv);
		car = SinOsc.ar(freq * cRatio + mod) * env * amp;

		car = Pan2.ar(car, pan);
		car = (car * 2).tanh * 0.5;

		//direct out/reverb send
		Out.ar(out, car);
		Out.ar(fx, car * fxsend.dbamp);
	}).add;

	SynthDef(\unstable_noise, { | sus = 2, atk = 0, rel = 0, c0 = 0, c1 = 0, tremolo = 6 |
		var sig, pitch, env;
		env = EnvGen.ar(
			Env([0,1,1,0],[atk,sus,rel],[c0,0,c1]),
			doneAction:2
		);
		pitch = XLine.kr(4000, 2000, 10);
		sig = (PinkNoise.ar()*40).clip2() * 0.5;
		sig = Resonz.ar(sig, {LFNoise0.kr(70).range(pitch, pitch*1.5)}!4, LFNoise0.kr(50).range(0.1, 0.01));
		sig = Splay.ar(sig);
		sig = (sig*0.1) + (sig * (Demand.kr(Impulse.kr(tremolo*75/60) + Impulse.kr(0), 0, Dseq([1, 0], inf))) * 0.9);
		sig = Balance2.ar(sig[0], sig[1], LFNoise0.kr(20)) * env * \amp.kr(0.5);
		Out.ar(\out.kr(0), sig);
	}).add;

	SynthDef(\percmix, {
		var sig;
		sig = In.ar(\in.kr(10), 2);
		sig = Compander.ar(sig, sig, 0.3, 1.0, 1/4, 0.04, 0.1);
		Out.ar(\out.ar(0), sig*\amp.kr(1.0));
	}).add;

	SynthDef(\ducking, {
		var sig;
		sig = In.ar(\in.kr(12), 2);
		sig = Compander.ar(sig, In.ar(\sidechain.kr(10)), \thresh.kr(0.3), 1.0, 1/5, \atk.kr(0.1), \rel.kr(0.3));
		sig = sig.tanh;
		Out.ar(\out.ar(0), sig*\amp.kr(1.0));
	}).add;

	SynthDef(\sineperc, { var freq = \freq.kr(100), sig, env;
		env = EnvGen.kr(Env.perc(\atk.kr(0.01), \rel.kr(1), 1.0, [\c0.kr(4), \c1.kr(-4)]), doneAction: 2);
		freq = XLine.ar(Rand(4000, 6000), freq, 0.006);
		sig = SinOsc.ar(freq) * 0.5 * \amp.kr(1);
		sig = sig * env;
		sig = Pan2.ar(sig, \pan.kr(0));
		Out.ar(0, sig);
	}).add;

	~fftsize = 2048;
	SynthDef(\convrev, {
		var sig, inSig, mix = \mix.kr(0.2);
		mix = XLine.kr(0.05, 0.3, 70);
		inSig = In.ar(\inbus.kr(10), 2);
		sig = PartConv.ar(inSig, ~fftsize, \irbuf.kr());
		sig = (sig*mix) + (inSig*(1-mix));

		Out.ar(\out.kr(0), sig);
	}).add;

	s.sync;

	fork{
		var irbuf, irspectrum, bufsize;
		// load IR buffer
		irbuf = Buffer.read(s, "ir/r1_ortf.wav".resolveRelative);
		s.sync;
		bufsize = PartConv.calcBufSize(~fftsize, irbuf);
		~irspectrum = Buffer.alloc(s, bufsize, 1);
		~irspectrum.preparePartConv(irbuf, ~fftsize);
		s.sync;
		irbuf.free();
	};
});
)


(
var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8], clock = TempoClock(75/60);
~revBus = Bus.audio(s, 2);
~kickBus = Bus.audio(s, 2);
~duckBus = Bus.audio(s, 2);
Synth(\percmix, [\in, ~kickBus, \out, 0], addAction: 'addToTail');
~ducksynth = Synth(\ducking, [\in, ~duckBus, \sidechain, ~kickBus, \thresh, 0.2, \out, ~revBus, \thresh, 0.010, \atk, 0.1, \rel, 0.35], addAction: 'addToTail');
Synth(\convrev, [\inbus, ~revBus, \irbuf, ~irspectrum], addAction: 'addToTail');

~endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8];



// SCORE

{ var unoise;

	// from below
	fork{ var startTime = SystemClock.seconds, run = true;
		while({run}, {
			rrand(1, 4).do {
				{ var sig, freq, startFreq, endFreq, time = rrand(2, 5), detune = Rand(0.02, 0.2).midiratio;
					startFreq = rrand(20, 100);
					endFreq = endChord.choose * 2;
					freq = XLine.kr(startFreq, endFreq, time);
					freq = [freq, freq*detune];
					sig = Pulse.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01 * AmpCompA.kr(freq);
					sig = sig * LFNoise2.kr(4).range(0.01, 1);
					sig = Pan2.ar(sig, LFNoise1.kr(0.2));
					Out.ar(~revBus, sig);
					FreeSelf.kr(DelayN.kr(Impulse.kr(0), time, time));
				}.play;
			};
			rrand(0.5, 2).wait;
			if(SystemClock.seconds - startTime > 5) {
				run = false;
			};
		});
	};

	3.wait;

	unoise = Synth(\unstable_noise, [\rel, 0.2, \atk, 0.8, \out, ~revBus]);

	// from above
	fork{ var startTime = SystemClock.seconds, run = true;
		while({run}, {
			rrand(1, 4).do {
				{ var sig, freq, startFreq, endFreq, time = rrand(2, 5), detune = Rand(0.02, 0.2).midiratio;
					startFreq = rrand(600, 10000);
					endFreq = endChord.choose;
					freq = XLine.kr(startFreq, endFreq, time);
					freq = [freq, freq*detune];
					sig = Pulse.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01 * AmpCompA.kr(freq);
					sig = sig * LFNoise2.kr(4).range(0.01, 1);
					sig = Pan2.ar(sig, LFNoise1.kr(0.2));
					Out.ar(~revBus, sig);
					FreeSelf.kr(DelayN.kr(Impulse.kr(0), time, time));
				}.play;
			};
			rrand(0.5, 2).wait;
			if(SystemClock.seconds - startTime > 20) {
				run = false;
			};
		});
	};


	2.wait;

	unoise = Synth(\unstable_noise, [\sus, 0.2, \atk, 0.2, \out, ~revBus]);


	//kick
	Pdef(\kick, Pbind(
		\instrument, \fm,
		\dur, 1/2,
		\freq, Pseq([25, Rest(), Rest(), Rest()], inf),
		\mRatio, 0.13,
		\index, 6,
		\iScale, 32,
		\atk, 0,
		\rel, 0.08,
		\amp, Pseq([Pgeom(0.8,-2.dbamp,8)],inf),
		\pan, Pseq([0.3,-0.3],inf),
		\out, ~kickBus,
		\fx, ~revBus,
		\fxsend, -16,
	)).play(clock, quant: 1);

	Pdef(\high_glitch, Pbind(
		\instrument, \fm,
		\dur, Pwhite(0.01, 0.05),
		\freq, Pwhite(8000, 10000),
		\mRatio, 1,
		\cRatio, 2,
		\index, 1,
		\iScale, 1,
		\atk, 0.01,
		\rel, 0.02,
		\amp, Pseq([Pgeom(0.1,-2.dbamp,8)],inf) * Pgeom(0.05, 1.009, inf),
		\pan, Pseq([0.3,-0.3],inf),
		\out, ~duckBus,
		\fx, ~revBus,
		\fxsend, -16,
	)).play();


	fork{ var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2;
		100.do {
			{ var sig, freq, startFreq, endFreq, time = rrand(1, 2), env;
				env = EnvGen.kr(Env(
					levels: [0, 0.5, 1, 0],
					times: [time, 6-time+1, 0.001],
					curve: [-8, -2, -6]
				), doneAction: 2);
				startFreq = rrand(20, 500);
				endFreq = endChord.choose;
				freq = XLine.kr(startFreq, endFreq, time);
				freq = freq * LFNoise1.kr(0.1).range(0.999, 1.001);
				sig = SinOsc.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01;
				sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(freq) * env;
				sig = Pan2.ar(sig, LFNoise1.kr(0.2));
				Out.ar(~duckBus, sig);
			}.play;
		};
	};

	4.wait;

	unoise = Synth(\unstable_noise, [\atk, 0.2, \out, ~revBus]);


	Pbindef(\high_glitch, \freq, Prand(~endChord, inf) * 32);

	/*fork{
		100.do {
			{ var sig, freq, startFreq, endFreq, time = rrand(50, 70), env;
				env = EnvGen.kr(Env(
					levels: [0, 0.5, 1, 0],
					times: [time, 70-time+4, 0.001],
					curve: [-8, -2, -6]
				), doneAction: 2);
				startFreq = rrand(200, 10000);
				endFreq = endChord.choose;
				freq = XLine.kr(startFreq, endFreq, time);
				freq = freq * LFNoise1.kr(0.1).range(0.999, 1.001);
				sig = SinOsc.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01;
				sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(freq) * env;
				sig = Pan2.ar(sig, LFNoise1.kr(0.2));
				Out.ar(~duckBus, sig);
			}.play;
		};
	};*/

	8.wait;

	Pbindef(\kick, \freq, Prand([Rest(), 25], inf));
	Pdef(\bass,
		Pbind(
			\instrument, \fm,
			\dur, 1/4,
			\freq, Prand([
				[endChord[0]*0.5, endChord[0]],
				Rest(),
			],inf) * Pwrand([1,2],[0.9,0.1],inf),
			\mRatio, 2,
			\index, 0.5,
			\iScale, Pseq([3,2.5,2,1],inf),
			\atk, 0,
			\rel, Pexprand(0.2,0.4,inf),
			\amp, Pseq([Pgeom(0.1,-3.dbamp,4)],inf),
			\pan, Pseq([-0.25,0.25],inf),
			\out, 0,
			\fx, ~revBus,
			\fxsend, -10,
	)).play(clock, quant: 1);

	Pbindef(\high_glitch, \freq, Prand(~endChord, inf) * 16);

	4.wait;

	{
		var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8], sig, mod, freq = endChord[0] * 2, env;
		env = Env.perc(0.01, 1.5).kr(2);
		mod = SinOsc.ar(freq*(8/LFNoise0.kr(16).range(1, 16))) * freq;
		sig = SinOsc.ar(freq + mod);
		sig = Pan2.ar(sig, rrand(-1.0, 1.0)) * env * 0.1;
		Out.ar(~duckBus, sig);
	}.play;

	4.wait;

	Pbindef(\high_glitch, \freq, Rest());
	{
		var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8], sig, mod, freq = endChord[1] * 2, env;
		env = Env.perc(0.01, 1.5).kr(2);
		mod = SinOsc.ar(freq*(8/LFNoise0.kr(16).range(1, 16))) * freq;
		sig = SinOsc.ar(freq + mod);
		sig = Pan2.ar(sig, rrand(-1.0, 1.0)) * env * 0.1;
		Out.ar(~duckBus, sig);
	}.play;

	4.wait;
	{
		var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8], sig, mod, freq = endChord[2] * 2, env;
		env = Env.perc(0.01, 1.5).kr(2);
		mod = SinOsc.ar(freq*(8/LFNoise0.kr(24).range(1, 16))) * freq;
		sig = SinOsc.ar(freq + mod);
		sig = Pan2.ar(sig, rrand(-1.0, 1.0)) * env * 0.1;
		Out.ar(~duckBus, sig);
	}.play;

	4.wait;
	{
		var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2,
		notes = endChord, speed = [1/4, 1/6, 1/8, 1/7].choose;
		notes = notes.sort;
		notes.postln;
		Pbind(\instrument, \sineperc,
			\freq, Pseq(notes) * 4,
			\dur, Pseq([speed], inf),
			\atk, 0.3,
			\rel, 0.1,
			\amp, Pgeom(0.05, 1.2),
			\out, ~revBus,
		).play(clock, quant: 1);
	}.fork;

	unoise = Synth(\unstable_noise, [\atk, 1, \rel, 1, \out, ~ revBus]);

	8.wait;
	fork{ var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2;
		100.do {
			{ var sig, freq, startFreq, endFreq, time = rrand(1, 2), env;
				env = EnvGen.kr(Env(
					levels: [0, 0.5, 1, 0],
					times: [time, 2-time+1, 0.001],
					curve: [-8, -2, -6]
				), doneAction: 2);
				startFreq = rrand(20, 500);
				endFreq = endChord.choose;
				freq = XLine.kr(startFreq, endFreq, time);
				freq = freq * LFNoise1.kr(0.1).range(0.999, 1.001);
				sig = SinOsc.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01;
				sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(freq) * env;
				sig = Pan2.ar(sig, LFNoise1.kr(0.2));
				Out.ar(~duckBus, sig);
			}.play;
		};
	};

	Pbindef(\high_glitch, \freq, Prand(endChord, inf) * Pwrand([16, 8, 4], [4, 1, 0.5].normalizeSum, inf),
		\amp, Pseq([Pgeom(0.1,-2.dbamp,8)],inf) * Pgeom(0.2, 1.005));

	Pbind(\instrument, \osc,
		\dur, 0.02,
		\freq, Prand([~endChord[0]], 100),
		\atk, Pgeom(0.1, 0.97),
		\rel, 0.02,
		\sus, 0,
		\amp, Pgeom(0.1, -0.4.dbamp),
		\pan, Pseq([0.3,-0.3],inf),
		\detune, Pwhite(0.0, 0.3, inf),
		\c0, exprand(3, 6).neg,
		\c1, -5,
		\buf, Prand(~wt_buf[6..9], inf),
		\out, 0,
		\rout, ~duckBus,
		\rsend, -10,
	).play;

	4.wait;

	Pbind(\instrument, \osc,
		\dur, 0.02,
		\freq, Prand([~endChord[0]], 100),
		\atk, Pgeom(0.1, 0.97),
		\rel, 0.02,
		\sus, 0,
		\amp, Pgeom(0.1, -0.4.dbamp),
		\pan, Pseq([0.3,-0.3],inf),
		\detune, Pwhite(0.0, 0.8, inf),
		\c0, exprand(3, 6).neg,
		\c1, -5,
		\buf, Prand(~wt_buf[6..9], inf),
		\out, 0,
		\rout, ~duckBus,
		\rsend, -10,
	).play;

	3.wait;

	Pbindef(\high_glitch, \freq, Rest());

	Pbind(\instrument, \osc,
		\dur, 0.02,
		\freq, Prand([~endChord[0]], 100),
		\atk, Pgeom(0.1, 0.97),
		\rel, 0.02,
		\sus, 0,
		\amp, Pgeom(0.1, -0.8.dbamp),
		\pan, Pseq([0.3,-0.3],inf),
		\detune, Pwhite(0.3, 2.0, inf),
		\c0, exprand(3, 6).neg,
		\c1, -5,
		\buf, Prand(~wt_buf[6..9], inf),
		\out, 0,
		\rout, ~duckBus,
		\rsend, -10,
	).play;

	1.wait;

	{
		var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2,
		notes = endChord, speed = 1/2;
		notes = notes.sort;
		notes.postln;
		Pbind(\instrument, \sineperc,
			\freq, Pseq(notes) * 8,
			\dur, Pseq([speed], inf),
			\atk, 0.8,
			\rel, 1.5,
			\amp, Pgeom(0.2, 0.6),
			\out, ~revBus,
		).play(clock, quant: 1);
	}.fork;

	4.wait;

	fork{ var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2];
		100.do {
			{ var sig, freq, startFreq, endFreq, time = rrand(1, 2), env;
				env = EnvGen.kr(Env(
					levels: [0, 0.5, 1, 0],
					times: [time, 6-time+1, 0.001],
					curve: [-8, -2, -6]
				), doneAction: 2);
				startFreq = rrand(20, 500);
				endFreq = endChord.choose;
				freq = XLine.kr(startFreq, endFreq, time);
				freq = freq * LFNoise1.kr(0.1).range(0.999, 1.001);
				sig = SinOsc.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01;
				sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(freq) * env;
				sig = Pan2.ar(sig, LFNoise1.kr(0.2));
				Out.ar(~duckBus, sig);
			}.play;
		};
	};


	4.wait;

	Pbindef(\high_glitch, \freq, Prand(endChord, inf) * Pwrand([16, 8, 4], [4, 1, 0.5].normalizeSum, inf),
		\amp, Pseq([Pgeom(0.1,-2.dbamp,8)],inf) * Pgeom(0.2, 1.03),
	);

	// from below
	fork{ var startTime = SystemClock.seconds, run = true;
		while({run}, {
			rrand(1, 4).do {
				{ var sig, freq, startFreq, endFreq, time = rrand(2, 5), detune = Rand(0.02, 0.2).midiratio;
					startFreq = rrand(20, 100);
					endFreq = endChord.choose * 2;
					freq = XLine.kr(startFreq, endFreq, time);
					freq = [freq, freq*detune];
					sig = Pulse.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01 * AmpCompA.kr(freq);
					sig = sig * LFNoise2.kr(4).range(0.01, 1);
					sig = Pan2.ar(sig, LFNoise1.kr(0.2));
					Out.ar(~revBus, sig);
					FreeSelf.kr(DelayN.kr(Impulse.kr(0), time, time));
				}.play;
			};
			rrand(0.5, 2).wait;
			if(SystemClock.seconds - startTime > 3) {
				run = false;
			};
		});
	};

	4.wait;

	Pbindef(\high_glitch, \freq, Rest());

	{
		var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2,
		notes = endChord ++ (endChord*2), speed = 1/4;
		notes = notes.sort;
		notes.postln;
		Pbind(\instrument, \sineperc,
			\freq, Pseq(notes) * 4,
			\dur, Pseq([speed], inf),
			\atk, 0.2,
			\rel, 0.3,
			\amp, Pgeom(0.2, 0.6),
			\out, ~revBus,
		).play(clock, quant: 1);
	}.fork;


	3.wait;

	Pbind(\instrument, \osc,
		\dur, 0.02,
		\freq, Prand([~endChord[0]], 100),
		\atk, Pgeom(0.1, 0.97),
		\rel, 0.02,
		\sus, 0,
		\amp, Pgeom(0.1, -0.4.dbamp),
		\pan, Pseq([0.3,-0.3],inf),
		\detune, Pwhite(0.0, 0.3, inf),
		\c0, exprand(3, 6).neg,
		\c1, -5,
		\buf, Prand(~wt_buf[6..9], inf),
		\out, 0,
		\rout, ~duckBus,
		\rsend, -10,
	).play;

	1.wait;

	Pbind(\instrument, \osc,
		\dur, 0.02,
		\freq, Prand([~endChord[0]], 100),
		\atk, Pgeom(0.1, 0.97),
		\rel, 0.02,
		\sus, 0,
		\amp, Pgeom(0.1, -0.4.dbamp),
		\pan, Pseq([0.3,-0.3],inf),
		\detune, Pwhite(0.5, 1.3, inf),
		\c0, exprand(3, 6).neg,
		\c1, -5,
		\buf, Prand(~wt_buf[6..9], inf),
		\out, 0,
		\rout, ~duckBus,
		\rsend, -10,
	).play;

	Pbindef(\high_glitch, \freq, Prand(endChord, inf) * Pwrand([16, 8, 4], [4, 1, 0.5].normalizeSum, inf),
		\amp, Pseq([Pgeom(0.1,-2.dbamp,8)],inf) * Pgeom(0.2, 1.006),
	);

	8.wait;

	Pbind(\instrument, \osc,
		\dur, 1/6,
		\freq, Prand([Rest(), ~endChord[0]], 16),
		\atk, 0.4,
		\rel, 0.02,
		\sus, 0,
		\amp, Pseq([Pgeom(0.1, -4.dbamp, 5)], inf),
		\pan, Pseq([0.3,-0.3],inf),
		\detune, Pwhite(0.0, 0.3, inf),
		\c0, exprand(3, 6).neg,
		\c1, -5,
		\buf, Prand(~wt_buf[1..9], inf),
		\out, 0,
		\rout, ~duckBus,
		\rsend, -10,
	).play;

	8.wait;
	Pbindef(\high_glitch, \amp, Pseq([Pgeom(0.05,-2.dbamp,8)],inf));

	8.wait;
	Pbindef(\high_glitch, \freq, Prand(endChord, inf) * Pwrand([8, 4, 2], [4, 2, 1].normalizeSum, inf));
	unoise = Synth(\unstable_noise, [\atk, 1]);
	2.wait;
	fork{ var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2;
		100.do {
			{ var sig, freq, startFreq, endFreq, time = rrand(1, 2), env;
				env = EnvGen.kr(Env(
					levels: [0, 0.5, 1, 0],
					times: [time, 2-time+1, 0.001],
					curve: [-8, -2, -6]
				), doneAction: 2);
				startFreq = rrand(20, 500);
				endFreq = endChord.choose;
				freq = XLine.kr(startFreq, endFreq, time);
				freq = freq * LFNoise1.kr(0.1).range(0.999, 1.001);
				sig = SinOsc.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01;
				sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(freq) * env;
				sig = Pan2.ar(sig, LFNoise1.kr(0.2));
				Out.ar(~duckBus, sig);
			}.play;
		};
	};
	2.wait;
	Pbindef(\high_glitch, \freq, Rest());
	fork{ var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2];
		100.do {
			{ var sig, freq, startFreq, endFreq, time = rrand(1, 2), env;
				env = EnvGen.kr(Env(
					levels: [0, 0.5, 1, 0],
					times: [time, 4-time+1, 0.001],
					curve: [-8, -2, -6]
				), doneAction: 2);
				startFreq = rrand(20, 500);
				endFreq = endChord.choose;
				freq = XLine.kr(startFreq, endFreq, time);
				freq = freq * LFNoise1.kr(0.1).range(0.999, 1.001);
				sig = SinOsc.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01;
				sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(freq) * env;
				sig = Pan2.ar(sig, LFNoise1.kr(0.2));
				Out.ar(~duckBus, sig);
			}.play;
		};
	};

	4.wait;
	{
		var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2,
		notes = endChord, speed = 1/6;
		notes = notes.sort;
		notes.postln;
		Pbind(\instrument, \sineperc,
			\freq, Pseq(notes) * 4,
			\dur, Pseq([speed], inf),
			\atk, 0.1,
			\rel, 2,
			\amp, Pgeom(0.2, 0.6),
			\out, ~revBus,
		).play(clock, quant: 1);
	}.fork;

	8.wait;

	4.wait;
	16.wait;

	Pdef(\bass).stop;

	8.wait;

	Pdef(\kick).stop;


}.fork(clock, quant: 1);


// fork{
// 	loop{
// 		Pbind(\instrument, \osc,
// 			\dur, Pstutter(8, Prand([1/4, 1/8, 1/12, 1/16], 8)),
// 			\freq, rrand(2000, 16000),
// 			\atk, exprand(0.01, 0.1),
// 			\sus, 0,
// 			\rel, exprand(0.05, 0.4),
// 			\detune, 2,
// 			\c0, exprand(3, 6).neg,
// 			\c1, -5,
// 			\buf, ~wt_buf[6..9].choose,
// 			\amp, Pgeom(0.03, 0.6)*0.2,
// 			\pan, rrand(-0.2, 0.2),
// 			\out, 0,
// 			\rout, ~revBus,
// 			\rsend, 10,
// 		).play;
// 		rrand(1, 4).wait;
// 	}
// };




/*//bass
Pbind(
	\instrument, \fm,
	\dur, 1/6,
	\freq, Pseq([
		Pseq([[endChord[0]*0.5, endChord[0]]],32),
Pseq([[endChord[1], endChord[1]*0.5]],24), Prand(endChord*0.5,8),
],inf) * Pwrand([1,2],[0.9,0.1],inf),
\mRatio, 2,
\index, 1.5,
\iScale, Pseq([3,2.5,2,1],inf),
\atk, 0,
\rel, Pexprand(0.2,0.4,inf),
\amp, Pseq([Pgeom(0.28,-3.dbamp,4)],inf),
\pan, Pseq([-0.25,0.25],inf),
\out, 0,
\fx, ~revBus,
\fxsend, -20,
).play;*/
fork{



	/*10.wait;
	Pbindef(\bass, \freq,
		Pseq([
			Pseq([[endChord[0]*0.5, endChord[0]]],32),
			Pseq([[endChord[0]*5/8, endChord[0]*5/8*0.5]],24), Prand(endChord*0.5,8),
		],inf) * Pwrand([1,2],[0.9,0.1],inf),
	);
	10.wait;
	Pbindef(\bass, \freq,
		Pseq([
			Pseq([[endChord[0]*0.5, endChord[0]]],32),
			Pseq([[endChord[1], endChord[1]*0.5]],24), Prand(endChord*0.25,8),
		],inf) * Pwrand([1,2],[0.9,0.1],inf),
	);
	50.wait;
	Pbindef(\bass, \freq,
		Prand([
			[endChord[0]*0.5, endChord[0]],
			Rest(),
		],inf) * Pwrand([1,2],[0.9,0.1],inf),
	);*/
};

)

(
{
	var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8], sig, mod, freq = endChord[..3].choose * 2, env;
	env = Env.perc(0.01, 1.5).kr(2);
	mod = SinOsc.ar(freq*(8/LFNoise0.kr(16).range(1, 16))) * freq;
	sig = SinOsc.ar(freq + mod);
	sig = Pan2.ar(sig, rrand(-1.0, 1.0)) * env * 0.1;
	Out.ar(~revBus, sig);
}.play;
)

(
{
	var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8], sig, mod, freq = endChord[..3].choose, env;
	freq = LFNoise0.kr(20).range(rrand(100, 900), rrand(1000, 4000));
	env = Env.perc(0.01, rrand(0.1, 0.5)).kr(2);
	mod = SinOsc.ar(freq*(8/LFNoise0.kr(2).range(1, 16))) * freq;
	sig = SinOsc.ar(freq + mod);
	sig = Pan2.ar(sig, rrand(-1.0, 1.0)) * 0.1;
	Out.ar(~revBus, sig);
}.play;
)

(var root = 50, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*8, root*2*5/2]*2;
fork{
	100.do {
		{ var sig, freq, startFreq, endFreq, time = rrand(1, 2), env;
			env = EnvGen.kr(Env(
				levels: [0, 0.5, 1, 0],
				times: [time, 7-time+1, 0.001],
				curve: [-8, -2, -6]
			), doneAction: 2);
			startFreq = rrand(20, 500);
			endFreq = endChord.choose;
			freq = XLine.kr(startFreq, endFreq, time);
			freq = freq * LFNoise1.kr(0.1).range(0.999, 1.001);
			sig = SinOsc.ar(freq, Line.kr(0.5, 0.1, time)) * 0.01;
			sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(freq) * env;
			sig = Pan2.ar(sig, LFNoise1.kr(0.2));
			Out.ar(~revBus, sig);
		}.play;
	};
};

)

(
SynthDef(\chord_converger, {
	var minFreq = 20, maxFreq = 1000, length = \length.kr(4), reachLength = length*Rand(0.5, 1.0), startFreq, freq = \freq.kr(200), sig, env, useFreq;
	env = EnvGen.kr(Env(
		levels: [0, 0.5, 1, 0],
		times: [reachLength, length-reachLength+\sus.kr(1), 0.001],
		curve: [-8, -2, -6]
	), doneAction: 2);
	startFreq = Rand(minFreq, maxFreq);
	useFreq = XLine.kr(startFreq, freq, reachLength);
	useFreq = useFreq * LFNoise1.kr(0.1).range(0.999, 1.001);
	sig = SinOsc.ar(useFreq, Line.kr(0.5, 0.1, reachLength)) * 0.01;
	sig = sig * LFNoise2.kr(4).range(0.01, 1) * AmpCompA.kr(useFreq) * env;
	sig = Pan2.ar(sig, LFNoise1.kr(0.2));
	Out.ar(\out.kr(0), sig);
}).add;
)
100.do{Synth(\chord_converger, [\length, 5, \freq, ~endChord.choose, \out, ~revBus])};

(
{
	var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8], sig, mod, freq = endChord[..3].choose, env;
	freq = freq*32;
	env = Env.perc(0.01, 1.5).kr(2);
	mod = SinOsc.ar(freq*(8/LFNoise0.kr(16).range(1, 16))) * freq;
	sig = SinOsc.ar(freq + mod);
	sig = Pan2.ar(sig, rrand(-1.0, 1.0)) * env * 0.1 * Dust.kr(30);
	Out.ar(~revBus, sig);
}.play;
)

(
var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8];
~endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8];
Pdef(\high_glitch, Pbind(
	\instrument, \fm,
	\dur, Pwhite(0.01, 0.05),
	\freq, Pwhite(8000, 10000),
	\mRatio, 1,
	\cRatio, 2,
	\index, 1,
	\iScale, 1,
	\atk, 0.01,
	\rel, 0.02,
	\amp, Pseq([Pgeom(0.4,-2.dbamp,8)],inf),
	\pan, Pseq([0.3,-0.3],inf),
	\out, 0,
	\fx, ~revBus,
	\fxsend, -16,
)).play();
)


(
var root = 100, endChord = [root*1, root*1.5, root*2*5/4, root*3, root*4, root*6, root*7*0.5, root*8];
Pbind(
	\instrument, \osc,
	\dur, Pwhite(0.01, 0.05),
	\freq, Pwhite(10000, 14000),
	\atk, 0.01,
	\rel, 0.02,
	\sus, 0,
	\amp, Pseq([Pgeom(0.1,-2.dbamp,8)],inf),
	\pan, Pseq([0.3,-0.3],inf),
	\detune, 0,
	\c0, exprand(3, 6).neg,
	\c1, -5,
	\buf, ~wt_buf[1],
	\out, 0,
	\rout, ~revBus,
	\rsend, -10,
).play();
)


// noise med instabilt filter

(
SynthDef(\unstable_noise, {
	var sig, pitch;
	pitch = XLine.kr(4000, 2000, 10);
	sig = (PinkNoise.ar()*40).clip2()*0.5;
	sig = (sig*40).tanh * 0.5;
	sig = Resonz.ar(sig, {LFNoise0.kr(70).range(pitch, pitch*1.5)}!4, LFNoise0.kr(50).range(0.1, 0.01));
	sig = Splay.ar(sig);
	sig = Balance2.ar(sig[0], sig[1], LFNoise0.kr(20));
	Out.ar(\out.kr(0), sig);
}).play;
)


// glitchy pitch
(
SynthDef(\glitchy_pitchy, {
	var sig;
	sig =
}).add;
)
(
Pbind(\instrument, \osc,
	\dur, 0.02,
	\freq, Prand([~endChord[0]], 100),
	\atk, Pgeom(0.1, 0.97),
	\rel, 0.02,
	\sus, 0,
	\amp, Pgeom(0.1, -0.4.dbamp),
	\pan, Pseq([0.3,-0.3],inf),
	\detune, Pwhite(0.0, 0.3, inf),
	\c0, exprand(3, 6).neg,
	\c1, -5,
	\buf, Prand(~wt_buf[6..9], inf),
	\out, 0,
	\rout, ~duckBus,
	\rsend, -10,
).play;
)

~ducksynth.set(\thresh, 0.015, \atk, 0.1, \rel, 0.35)

(
Pdef(\kick, Pbind(
		\instrument, \fm,
		\dur, 1/2,
		\freq, Pseq([25], inf),
		\mRatio, 0.13,
		\index, 6,
		\iScale, 32,
		\atk, 0,
		\rel, 0.08,
		\amp, Pseq([Pgeom(0.9,-2.dbamp,8)],inf),
		\pan, Pseq([0.3,-0.3],inf),
		\out, 0,
		\fx, ~revBus,
		\fxsend, -16,
)).play();
)