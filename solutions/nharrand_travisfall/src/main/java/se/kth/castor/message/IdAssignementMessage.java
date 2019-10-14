package se.kth.castor.message;

import org.json.JSONObject;

public class IdAssignementMessage extends AbstractMessage {
	int timestamp;
	int playerId;

	public IdAssignementMessage(int timestamp, int playerId) {
		this.timestamp = timestamp;
		this.playerId = playerId;
	}

	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("timestamp", timestamp);
		res.put("playerId", playerId);
		return res;
	}

	public IdAssignementMessage(JSONObject in) {
		this.timestamp = in.getInt("timestamp");
		this.playerId = in.getInt("playerId");
	}

	@Override
	public int getType() {
		return AbstractMessage.IdAssignementMessageType;
	}
}