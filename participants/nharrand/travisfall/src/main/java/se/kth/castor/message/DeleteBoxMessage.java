package se.kth.castor.message;

import org.json.JSONObject;

public class DeleteBoxMessage extends AbstractMessage {
	int timestamp;
	int boxId;

	public DeleteBoxMessage(int timestamp, int boxId) {
		this.timestamp = timestamp;
		this.boxId = boxId;
	}

	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("timestamp", timestamp);
		res.put("boxId", boxId);
		return res;
	}

	public DeleteBoxMessage(JSONObject in) {
		this.timestamp = in.getInt("timestamp");
		this.boxId = in.getInt("boxId");
	}

	@Override
	public int getType() {
		return AbstractMessage.DeleteBoxMessageType;
	}
}