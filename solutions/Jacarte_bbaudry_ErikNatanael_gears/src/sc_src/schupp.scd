(
{
	var sig, env, freq, clap, popEnv, centerFreq = Rand(1000, 1700), length = Rand(0.05, 0.3);
	env = EnvGen.ar(
		Env(
			levels: [0, 1, 0],
			times: [length, 1],
			curve: [4, -20]
		),
		doneAction:2
	);
	popEnv = EnvGen.ar(Env([3261, 410, Rand(30, 80)], [0.002, 0.01], curve: \exp));
	clap = SinOsc.ar(popEnv) * EnvGen.ar(Env.perc(0.0001, ExpRand(0.06, 0.3)));
	clap = clap + (BPF.ar(WhiteNoise.ar, 900, 1.9) * EnvGen.ar(Env.perc(0.001, 0.5)));
	clap = DelayN.ar(clap, length*2, length*0.9);

	freq = [
		EnvGen.ar(Env([centerFreq*Rand(0.1, 0.3), centerFreq], [length], [Rand(4, 7)])),
		EnvGen.ar(Env([centerFreq*Rand(0.2, 0.4), centerFreq], [length], [Rand(2, 8)]))];
	sig = Resonz.ar(WhiteNoise.ar(), freq, 0.3)*3;
	sig = Mix(sig);
	//sig = sig + clap;
	sig = Pan2.ar(sig);
	sig = sig * env * 0.5;
	//sig = FreeVerb.ar(sig, 0.05);
	Out.ar(\out.kr(0), sig);
}.play;
)
