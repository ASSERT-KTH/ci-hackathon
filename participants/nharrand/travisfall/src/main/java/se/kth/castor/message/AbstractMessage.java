package se.kth.castor.message;

import org.eclipse.jetty.websocket.api.Session;
import org.json.JSONObject;

import java.text.ParseException;
import java.util.ArrayDeque;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.concurrent.DelayQueue;


public abstract class AbstractMessage {
	public static final int TrajectoryChangeMessageType = 0;
	public static final int NewBlockMessageType = 1;
	public static final int NewPlayerMessageType = 2;
	public static final int PlayerDeathMessageType = 3;
	public static final int IdAssignementMessageType = 4;
	public static final int DeleteBoxMessageType = 5;
	public static final int EphemeralMessageType = 6;
	public static final int RequestForLifeMessageType = 7;
	public static final int HeartbeatMessageType = 255;


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

			case IdAssignementMessageType:
				return new IdAssignementMessage(in);

			case DeleteBoxMessageType:
				return new DeleteBoxMessage(in);

			case EphemeralMessageType:
				return new EphemeralMessage(in);

			case RequestForLifeMessageType:
				return new RequestForLifeMessage(in);

			case HeartbeatMessageType:
				return new HeartbeatMessage(in);

			default:
				throw new MessageParsingException();
		}
	}

	public static void sendTo(Session session, AbstractMessage message) {
			messagesToSend.add(new HashMap.SimpleEntry<>(session, message));
	}

	static ConcurrentLinkedQueue<Map.Entry<Session, AbstractMessage>> messagesToSend = new ConcurrentLinkedQueue<>();

	public synchronized static void sendMessages() {
		while (!messagesToSend.isEmpty()) {
			Map.Entry<Session, AbstractMessage> e = messagesToSend.poll();
			Session session = e.getKey();
			AbstractMessage message = e.getValue();
			try {
				if (session.isOpen()) {
					session.getRemote().sendString(message.toJSONString());
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
	}
}
