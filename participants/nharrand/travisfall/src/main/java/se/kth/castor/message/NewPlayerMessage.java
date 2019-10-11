package se.kth.castor.message;

import org.json.JSONObject;

public class NewPlayerMessage extends AbstractMessage {
	int timestamp;
	int playerId;
	int color1;
	int color2;
	double gravity;
	double speed;
	int jump;
	int h,w;
	double x, y, dx, dy;
	long score;

	public NewPlayerMessage(int timestamp, int playerId, int color1, int color2, double gravity, double speed, int jump, int h, int w, double x, double y, double dx, double dy, long score) {
		this.timestamp = timestamp;
		this.playerId = playerId;
		this.color1 = color1;
		this.color2 = color2;
		this.gravity = gravity;
		this.speed = speed;
		this.jump = jump;
		this.h = h;
		this.w = w;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.score = score;
	}

	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("timestamp", timestamp);
		res.put("playerId", playerId);
		res.put("color1", color1);
		res.put("color2", color2);
		res.put("gravity", gravity);
		res.put("speed", speed);
		res.put("jump", jump);
		res.put("x", x);
		res.put("y", y);
		res.put("dx", dx);
		res.put("dy", dy);
		res.put("h", h);
		res.put("w", w);
		res.put("score", score);
		return res;
	}

	public NewPlayerMessage(JSONObject in) {
		this.timestamp = in.getInt("timestamp");
		this.playerId = in.getInt("playerId");
		this.color1 = in.getInt("color1");
		this.color2 = in.getInt("color2");
		this.gravity = in.getDouble("gravity");
		this.speed = in.getInt("speed");
		this.jump = in.getInt("jump");
		this.x = in.getDouble("x");
		this.y = in.getDouble("y");
		this.dx = in.getDouble("dx");
		this.dy = in.getDouble("dy");
		this.h = in.getInt("h");
		this.w = in.getInt("w");
		this.score = in.getLong("score");
	}

	@Override
	public int getType() {
		return AbstractMessage.NewPlayerMessageType;
	}
}
