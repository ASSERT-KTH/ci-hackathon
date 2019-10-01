(
o = OSCdef(\travis, {
	arg msg, time, addr, recvPort;
	var json;
	// the message is received as a symbol so it needs to be converted to a string before being parsed to a Dictionary
	// The number argument to .asString() is the maximum amount of characters converted. We don't want to fail on long strings.
	json = msg[1].asString(32768).parseYAML;
	~parseTravis.value(json);
}, '/travis-via-osc', n);

// Examples of fields in the travis build data that may be interesting:
// data.state
// event
// data.repository_id
// data.repository_slug
// data.config.language
// data.commit.committer_name
// data.commit.author_name
// data.commit.message

~parseTravis = { |json|
	"New ------------------------------------------".postln;
	json["data"]["state"].postln;
	json["event"].postln;
	json["data"]["repository_id"].postln;
	json["data"]["repository_slug"].postln;
	json["data"]["config"]["language"].postln;
	json["data"]["commit"]["committer_name"].postln;
	json["data"]["commit"]["author_name"].postln;
	json["data"]["commit"]["message"].postln;
};
)

