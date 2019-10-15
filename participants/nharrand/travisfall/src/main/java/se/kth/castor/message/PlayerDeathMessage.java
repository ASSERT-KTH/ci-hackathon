package se.kth.castor.message;

import org.json.JSONObject;

public class PlayerDeathMessage extends AbstractMessage {
	public int timestamp;
	public int playerId;
	public int h,w;
	public double x, y;

	public int responsibleId;

	public PlayerDeathMessage(int timestamp, int playerId, int h, int w, double x, double y, int responsibleId) {
		this.timestamp = timestamp;
		this.playerId = playerId;
		this.h = h;
		this.w = w;
		this.x = x;
		this.y = y;
		this.responsibleId = responsibleId;
	}

	@Override
	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("timestamp", timestamp);
		res.put("playerId", playerId);
		res.put("x", x);
		res.put("y", y);
		res.put("h", h);
		res.put("w", w);
		res.put("responsibleId", responsibleId);
		return res;
	}



	public PlayerDeathMessage(JSONObject in) {
		this.timestamp = in.getInt("timestamp");
		this.playerId = in.getInt("playerId");
		this.x = in.getDouble("x");
		this.y = in.getDouble("y");
		this.h = in.getInt("h");
		this.w = in.getInt("w");
		this.responsibleId = in.getInt("responsibleId");
	}

	@Override
	public int getType() {
		return AbstractMessage.PlayerDeathMessageType;
	}
}
