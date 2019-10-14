package se.kth.castor.message;

import org.json.JSONObject;

public class NewBlockMessage extends AbstractMessage {
	int timestamp;
	int boxId;
	int color;
	int h, w;
	double gravity;
	double x,y, dx, dy;
	int type;

	public NewBlockMessage(int timestamp, int boxId, int color, int h, int w, double gravity, double x, double y, double dx, double dy, int type) {
		this.timestamp = timestamp;
		this.boxId = boxId;
		this.color = color;
		this.h = h;
		this.w = w;
		this.gravity = gravity;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.type = type;
	}

	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("timestamp", timestamp);
		res.put("boxId", boxId);
		res.put("color", color);
		res.put("gravity", gravity);
		res.put("h", h);
		res.put("w", w);
		res.put("x", x);
		res.put("y", y);
		res.put("dx", dx);
		res.put("dy", dy);
		res.put("type", type);
		return res;
	}

	public NewBlockMessage(JSONObject in) {
		this.timestamp = in.getInt("timestamp");
		this.boxId = in.getInt("boxId");
		this.color = in.getInt("color");
		this.gravity = in.getDouble("gravity");
		this.h = in.getInt("h");
		this.w = in.getInt("w");
		this.x = in.getDouble("x");
		this.y = in.getDouble("y");
		this.dx = in.getDouble("dx");
		this.dy = in.getDouble("dy");
		this.type = in.getInt("type");
	}

	@Override
	public int getType() {
		return AbstractMessage.NewBlockMessageType;
	}
}