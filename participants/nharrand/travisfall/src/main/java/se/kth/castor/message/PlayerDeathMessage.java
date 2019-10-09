package se.kth.castor.message;

import org.json.JSONObject;

public class PlayerDeathMessage extends AbstractMessage {
	public int timestamp;
	public int playerId;
	public int color1;
	public int color2;
	public int h,w;
	public double x, y;

	public PlayerDeathMessage(int timestamp, int playerId, int color1, int color2, int h, int w, double x, double y) {
		this.timestamp = timestamp;
		this.playerId = playerId;
		this.color1 = color1;
		this.color2 = color2;
		this.h = h;
		this.w = w;
		this.x = x;
		this.y = y;
	}

	@Override
	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("timestamp", timestamp);
		res.put("playerId", playerId);
		res.put("color1", color1);
		res.put("color2", color2);
		res.put("x", x);
		res.put("y", y);
		res.put("h", h);
		res.put("w", w);
		return res;
	}



	public PlayerDeathMessage(JSONObject in) {
		this.timestamp = in.getInt("timestamp");
		this.playerId = in.getInt("playerId");
		this.color1 = in.getInt("color1");
		this.color2 = in.getInt("color2");
		this.x = in.getDouble("x");
		this.y = in.getDouble("y");
		this.h = in.getInt("h");
		this.w = in.getInt("w");
	}

	@Override
	public int getType() {
		return AbstractMessage.PlayerDeathMessageType;
	}
}
