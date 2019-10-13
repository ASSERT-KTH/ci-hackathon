package se.kth.castor.message;

import org.eclipse.jetty.websocket.api.Session;
import org.json.JSONObject;

import java.text.ParseException;


public abstract class AbstractMessage {
	public static final int TrajectoryChangeMessageType = 0;
	public static final int NewBlockMessageType = 1;
	public static final int NewPlayerMessageType = 2;
	public static final int PlayerDeathMessageType = 3;
	public static final int IdAssignementMessage = 4;
	public static final int DeleteBoxMessage = 5;
	public static final int EphemeralMessage = 6;
	public static final int HeartbeatMessage = 255;


	public abstract JSONObject toJSON();
	public abstract int getType();

	public String toJSONString() {
		JSONObject res = toJSON();
		res.put("t", getType());
		return res.toString();
	}

	public static AbstractMessage parseMessage(String json) throws MessageParsingException {
		JSONObject in = new JSONObject(json);
		int type = in.getInt("t");
		switch (type) {
			case TrajectoryChangeMessageType:
				return new TrajectoryChangeMessage(in);

			case NewBlockMessageType:
				return new NewBlockMessage(in);

			case NewPlayerMessageType:
				return new NewPlayerMessage(in);

			case PlayerDeathMessageType:
				return new PlayerDeathMessage(in);

			case IdAssignementMessage:
				return new IdAssignementMessage(in);

			case DeleteBoxMessage:
				return new DeleteBoxMessage(in);

			case EphemeralMessage:
				return new EphemeralMessage(in);

			default:
				throw new MessageParsingException();
		}
	}

	public static void sendTo(Session session, AbstractMessage message) {
		try {
			session.getRemote().sendString(message.toJSONString());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
