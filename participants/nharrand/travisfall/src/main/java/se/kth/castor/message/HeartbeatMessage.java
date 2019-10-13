package se.kth.castor.message;

import org.json.JSONObject;

public class HeartbeatMessage extends AbstractMessage {
	public JSONObject content;

	public HeartbeatMessage(JSONObject in) {
		content = in;
	}
	public HeartbeatMessage() {
		content = new JSONObject();
	}

	@Override
	public JSONObject toJSON() {
		return content;
	}

	@Override
	public int getType() {
		return AbstractMessage.HeartbeatMessageType;
	}
}
