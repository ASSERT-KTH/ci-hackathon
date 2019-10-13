package se.kth.castor.message;

import org.json.JSONObject;

public class RequestForLifeMessage extends AbstractMessage {
	public String nick;


	public RequestForLifeMessage(String nick) {
		this.nick = nick;
	}

	public JSONObject toJSON() {
		JSONObject res = new JSONObject();
		res.put("nick",nick);
		return res;
	}

	public RequestForLifeMessage(JSONObject in) {
		this.nick = in.getString("nick");
	}

	@Override
	public int getType() {
		return AbstractMessage.RequestForLifeMessageType;
	}
}