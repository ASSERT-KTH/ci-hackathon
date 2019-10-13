package se.kth.castor.message;

import org.json.JSONObject;

public class EphemeralMessage extends AbstractMessage {
	JSONObject content;
	public EphemeralMessage(JSONObject in) {
		content = in;
	}

	@Override
	public JSONObject toJSON() {
		return content;
	}

	@Override
	public int getType() {
		return AbstractMessage.EphemeralMessageType;
	}
}
