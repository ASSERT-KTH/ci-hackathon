(
// simple reverb (must go first to end up last in the node list on the server)
{ var sig;
	sig = In.ar(0, 2);
	sig = sig + (JPverb.ar(sig, 4.4, 0.0, 4.0, lowcut: 100, highcut: 1000) * 0.2);
	Out.ar(0, sig);
}.play;

// amplifier feedback simulation
{
	var sig, freqs, amps, detune = 0.2.midiratio, in, delfreq, amp, dampening, env, pulse;
	env = EnvGen.kr(Env([0, 1, 1, 0], [4, 60*5, 20], [2, 0, -4]));
	amp = LFNoise2.kr(1).range(0, 10);
	// amp = MouseY.kr(0,10);
	dampening = LFNoise2.kr(4).range(200, XLine.kr(1500, 5000, 60*5));
	// dampening = MouseX.kr(200,10000,1);

	in = LocalIn.ar(2);

	detune = LFNoise1.kr(LFNoise1.kr(1).range(0.1, 1)).range(0.1, 1).midiratio;
	freqs = 8.collect{|i| 40*(detune.pow(i+1)) };
	amps = SinOsc.kr([2, 3.3, 2.5], Rand(0, pi*2)).range(0.08, 0.25);
	pulse = SinOsc.kr(LFNoise1.kr(1/10).range(3, 6), 2).range(LFNoise1.kr(1/5).range(0.4, 0.7), 1);

	sig = in + WhiteNoise.ar(0.001);

	delfreq = 10;
	sig = DelayN.ar(sig,1/10-ControlDur.ir,1/delfreq-ControlDur.ir);

	sig = CombL.ar(sig!8, 0.2, 1/freqs).mean;
	//sig = (sig*MouseY.kr(1, 100)).tanh * 0.5 * amps;
	sig = (sig*100).tanh * 0.15;
	sig = LPF.ar(sig,8000);
	sig = HPF.ar(sig*amp,80);
	sig = RLPFD.ar(sig,dampening*[1,1.1],0.1,0.5);
	//sig = sig + sig.mean;
	LocalOut.ar(DelayN.ar(sig, ControlDur.ir, ControlDur.ir));
	Out.ar(0, sig*0.1*env * pulse);
}.play;


// THESE TWO TOGETHER ^ \/

// colliding low frequency sine waves
{
	var sig, freqs, amps, detune = 0.2.midiratio, amplify = LFNoise2.kr(1/3).range(3, 10), dampening, env;
	env = EnvGen.kr(Env([0, 1, 1, 0], [4, 60*5, 20], [2, 0, -4]));
	dampening = LFNoise2.kr(2).range(100, 500);
	detune = LFNoise0.kr(LFNoise1.kr(1).range(0.1, 1)).range(0.1, 1).midiratio;
	freqs = 3.collect{|i| 40*(detune.pow(i+1)) };
	amps = SinOsc.kr([5, 3.3, 2.5]).range(0.08, 0.25);
	sig = SinOsc.ar(freqs);
	sig = (sig*amplify).tanh * 0.5 * amps;
	sig = Splay.ar(sig);
	sig = (sig*200).tanh * 0.1;
	sig = RLPFD.ar(sig*3,dampening*[1,1.1],0.0,1.0);
	sig = HPF.ar(sig, 60);
	Out.ar(0, sig*env);
}.play;


)


( // crazy sine cresc., don't use
{
	var sig, freqs, amps, detune = 0.2.midiratio;
	detune = SinOsc.kr(1/10).range(0.1, 2);
	freqs = 7.collect{|i| 40*(detune.pow(i+1)) };
	amps = SinOsc.kr([4, 5, 6], Rand(0, pi*2)).range(0.08, 0.25);
	sig = SinOsc.ar(freqs);
	sig = (sig*100).tanh * 0.5;
	sig = Splay.ar(sig);
	Out.ar(0, sig);
}.play;
)