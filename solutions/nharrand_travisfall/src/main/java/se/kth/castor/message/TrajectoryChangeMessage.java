package se.kth.castor.message;

import org.json.JSONObject;

public class TrajectoryChangeMessage extends AbstractMessage {
	public int timestamp;
	public int playerId;
	public double x,y,dx,dy;

	public TrajectoryChangeMessage(int timestamp, int playerId, double x, double y, double dx, double dy) {
		this.timestamp = timestamp;
		this.playerId = playerId;
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
	}

	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("timestamp", timestamp);
		res.put("playerId", playerId);
		res.put("x", x);
		res.put("y", y);
		res.put("dx", dx);
		res.put("dy", dy);
		return res;
	}

	@Override
	public int getType() {
		return AbstractMessage.TrajectoryChangeMessageType;
	}

	public TrajectoryChangeMessage(JSONObject in) {
		this.timestamp = in.getInt("timestamp");
		this.playerId = in.getInt("playerId");
		this.x = in.getDouble("x");
		this.y = in.getDouble("y");
		this.dx = in.getDouble("dx");
		this.dy = in.getDouble("dy");
	}
}
